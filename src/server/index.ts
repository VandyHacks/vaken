import { ApolloServer, IResolvers, makeExecutableSchema } from 'apollo-server-express';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import MongoStore, { MongoUrlOptions } from 'connect-mongo';
import gqlSchema from '../common/schema.graphql';
import { resolvers } from './resolvers';
import DB from './models';
import Context from './context';
import logger from './logger';
import { StrategyNames, registerAuthRoutes } from './auth';
import { UnsubscribeHandler } from './mail/handlers';
import { UserDbInterface } from './generated/graphql';
import { pullCalendar } from './events';
import { sendToDiscord, discordCallback } from './auth/discord';

import { serverPlugins, authPlugins } from './plugins';

const { SESSION_SECRET, PORT, CALENDARID, NODE_ENV, DISCORD_CALLBACK_URL } = process.env;

if (!SESSION_SECRET) throw new Error(`SESSION_SECRET not set`);
if (!PORT) throw new Error(`PORT not set`);
if (!CALENDARID) logger.info('CALENDARID not set; skipping ical integration');
logger.info(`Node env: ${NODE_ENV}`);

const app = express();

const pluginResolvers = serverPlugins.map(serverPlugin => {
	return serverPlugin.resolvers;
});

const pluginTypeDefs = serverPlugins.map(serverPlugin => {
	return serverPlugin.schema;
});

export const schema = makeExecutableSchema({
	resolverValidationOptions: {
		requireResolversForAllFields: true,
		requireResolversForResolveType: false,
	},
	resolvers: [resolvers as IResolvers, ...(pluginResolvers as IResolvers[])],
	typeDefs: [DIRECTIVES, gqlSchema, ...pluginTypeDefs],
});

(async () => {
	const dbClient = new DB();
	const models = await dbClient.collections;
	app.use(
		helmet.contentSecurityPolicy({
			useDefaults: true,
			directives: {
				'connect-src': ["'self'", 'https://*'],
			},
		})
	); // sets good security defaults, see https://helmetjs.github.io/

	// Register auth functions
	app.use(
		session({
			secret: SESSION_SECRET,
			store: new (MongoStore(session))(({
				clientPromise: dbClient.client,
			} as unknown) as MongoUrlOptions),
			// resave: false,
			saveUninitialized: true,
			cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
			// cookie: {
			// 	/*
			// 		can't use secure cookies b/c only HTTP connection between dyno and Heroku servers,
			// 		but don't need it as long as connection as Heroku servers and client are HTTPS
			// 	*/
			// 	// secure: IS_PROD,
			// 	// httpOnly: true, // protects against XSS attacks
			// 	signed: true,
			// 	sameSite: true,
			// },
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());

	// passport.use('github', strategies.github(models));
	// passport.use('google', strategies.google(models));
	// passport.use('microsoft', strategies.microsoft(models));

	// array to hold all oAuth strategies to be used with registering routes and working with passport
	const oAuthStrategies: StrategyNames[] = [];

	// iterate through config, pulling out oauth packages and generating their passport configuration
	authPlugins.forEach(config => {
		passport.use(config.name, config.strategy(models));
		// Add this strategy to the oAuthStrategies array
		oAuthStrategies.push({
			name: config.name,
			displayName: config.displayName,
			scopes: config.scopes,
		});
		// console.error(config); // sanity check for auth plugin
	});

	registerAuthRoutes(app, oAuthStrategies);

	app.use((req, res, next) =>
		passport.authenticate(
			[
				'session',
				...oAuthStrategies.map(config => {
					return config.name;
				}),
			],
			(err, user) => {
				if (err) return void next();
				return void req.login(user, next);
			}
		)(req, res, next)
	);

	// Email unsubscribe link
	app.use('/api/unsubscribe', UnsubscribeHandler(models));

	// Pull events callback
	app.use('/api/manage/events/pull', async (req, res) => {
		const calendar = await pullCalendar(CALENDARID);
		res.send(calendar);
	});

	// Send user to Discord auth location
	app.use('/api/auth/discord', sendToDiscord);

	// Callback for Discord Auth
	if (DISCORD_CALLBACK_URL) {
		app.use(DISCORD_CALLBACK_URL, discordCallback);
	} else {
		logger.error('Skipping discord auth, `DISCORD_CALLBACK_URL` not supplied');
	}

	const db = (await dbClient.client).db('vaken');

	const server = new ApolloServer({
		context: ({ req }): Context => ({
			db,
			models,
			user: req.user as UserDbInterface | undefined,
		}),
		formatError: error => {
			logger.error(error);
			// give friendly error message to frontend, hide internal server details
			return new Error(error.message);
		},
		// introspection: NODE_ENV !== 'production', // OFF by default in prod for security reasons
		// playground: NODE_ENV !== 'production', // by DEFAULT, enabled when not in prod + disabled in prod
		schema,
	});

	server.applyMiddleware({ app });

	if (NODE_ENV !== 'development') {
		logger.info('Setting routing to prod assets.');
		// Serve front-end asset files in prod.
		app.use(express.static('dist/client'));
		// MUST BE LAST AS THIS WILL REROUTE ALL REMAINING TRAFFIC TO THE FRONTEND!
		app.use((req, res) => {
			res.sendFile('index.html', { root: 'dist/client' });
		});
	}

	app.listen(
		{ port: PORT },
		() => void logger.info(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
	);
})();

// for testing
export default app;
