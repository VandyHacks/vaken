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

import { serverPlugins, authPlugins } from './plugins';

const { SESSION_SECRET, PORT, CALENDARID, NODE_ENV } = process.env;
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

	// app.use(helmet()); // sets good security defaults, see https://helmetjs.github.io/

	app.use(
		helmet({
			// {
			contentSecurityPolicy: false,
			// useDefaults: true,
			// 		directives: {
			// 			...helmet.contentSecurityPolicy.getDefaultDirectives(),
			// 			'connect-src': [
			// 				"'self'",
			// 				'https://storage.googleapis.com/vaken-resume-dump/60846a6cbd2af64a98f39eb9?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=resume-manager%40vandyhacks-test.iam.gserviceaccount.com%2F20210608%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20210608T162810Z&X-Goog-Expires=901&X-Goog-SignedHeaders=content-type%3Bhost&X-Goog-Signature=4bc8fbe2183683ebfc79ed51a817ef14175c569a660c7f21a751882ec3c6d4cdbb110918fc2ac98ce79ffd19e8e9364339a9e669e80eb5080855d8d695559da0cb8ab1c4ce2469e4a8e02de64aa597b4ce2e9b29cbd0ad5bbe6a2bf765cda44753c5862af35c2a5a2c43f1b967b6371b61fb8270e257da06df37ddffd9c548414dc89c1e548d8025aef30db47a441d651df94775cf71c3ab34d1686f3343cbad961626c2dc957b08581205a6b59480677c1f2531fb46f478073f4e8c0b76ba9bd300e4dc6073293a733af1089abeb0cb5e2b0129e3daa0ee2bfe4cd26629ba7c38bd9705f93679626dedf0b10cbb850c37dc4a1316055b00e6231c6040f93eb0',
			// 				'https://o307001.ingest.sentry.io/api/1234567/store/?sentry_key=00591ab5e07047ff89b475b334837339&sentry_version=7',
			// 			],
			// 		},
			// 	},
			crossOriginResourcePolicy: { policy: 'cross-origin' },
		})
	);

	app.all('*', function (req, res, next) {
		res.header('Access-Control-Allow-Origin', '*');
		res.header('Access-Control-Allow-Credentials', 'true');
		res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept, Authorization'
		);
		next();
	});

	// Sets all of the defaults, but overrides `script-src` and disables the default `style-src`
	// app.use(
	// 	helmet.contentSecurityPolicy({
	// 		useDefaults: true,
	// 		directives: {
	// 			'connect-src': [
	// 				"'self'",
	// 				'https://storage.googleapis.com/vaken-resume-dump/60846a6cbd2af64a98f39eb9?X-Goog-Algorithm=GOOG4-RSA-SHA256&X-Goog-Credential=resume-manager%40vandyhacks-test.iam.gserviceaccount.com%2F20210608%2Fauto%2Fstorage%2Fgoog4_request&X-Goog-Date=20210608T162810Z&X-Goog-Expires=901&X-Goog-SignedHeaders=content-type%3Bhost&X-Goog-Signature=4bc8fbe2183683ebfc79ed51a817ef14175c569a660c7f21a751882ec3c6d4cdbb110918fc2ac98ce79ffd19e8e9364339a9e669e80eb5080855d8d695559da0cb8ab1c4ce2469e4a8e02de64aa597b4ce2e9b29cbd0ad5bbe6a2bf765cda44753c5862af35c2a5a2c43f1b967b6371b61fb8270e257da06df37ddffd9c548414dc89c1e548d8025aef30db47a441d651df94775cf71c3ab34d1686f3343cbad961626c2dc957b08581205a6b59480677c1f2531fb46f478073f4e8c0b76ba9bd300e4dc6073293a733af1089abeb0cb5e2b0129e3daa0ee2bfe4cd26629ba7c38bd9705f93679626dedf0b10cbb850c37dc4a1316055b00e6231c6040f93eb0',
	// 				'https://o307001.ingest.sentry.io/api/1234567/store/?sentry_key=00591ab5e07047ff89b475b334837339&sentry_version=7',
	// 			],
	// 		},
	// 	})
	// );

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
		app.use(express.static('dist/src/server/app'));
		// MUST BE LAST AS THIS WILL REROUTE ALL REMAINING TRAFFIC TO THE FRONTEND!
		app.use((req, res) => {
			res.sendFile('index.html', { root: 'dist/src/server/app' });
		});
	}

	app.listen(
		{ port: PORT },
		() => void logger.info(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
	);
})();

// for testing
export default app;
