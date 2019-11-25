import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
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
import { strategies, registerAuthRoutes } from './auth';
import { UnsubscribeHandler } from './mail/handlers';
import { UserDbInterface } from './generated/graphql';
import { pullCalendar } from './events';

const { SESSION_SECRET, PORT, CALENDARID, NODE_ENV } = process.env;
if (!SESSION_SECRET) throw new Error(`SESSION_SECRET not set`);
if (!PORT) throw new Error(`PORT not set`);
if (!CALENDARID) logger.info('CALENDARID not set; skipping ical integration');
const IS_PROD = NODE_ENV === 'production';
logger.info(`Node env: ${NODE_ENV}`);

const app = express();

export const schema = makeExecutableSchema({
	resolverValidationOptions: {
		requireResolversForAllFields: true,
		requireResolversForResolveType: false,
	},
	resolvers: resolvers as {},
	typeDefs: [DIRECTIVES, gqlSchema],
});

(async () => {
	const dbClient = new DB();
	const models = await dbClient.collections;

	app.use(helmet()); // sets good security defaults, see https://helmetjs.github.io/

	// Register auth functions
	app.use(
		session({
			secret: SESSION_SECRET,
			store: new (MongoStore(session))(({
				clientPromise: dbClient.client,
			} as unknown) as MongoUrlOptions),
			/*
			can't use secure cookies b/c only HTTP connection between dyno and Heroku servers, 
			but don't need it as long as connection as Heroku servers and client are HTTPS
			*/
			// cookie: { secure: IS_PROD },
		})
	);
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use('github', strategies.github(models));
	passport.use('google', strategies.google(models));
	passport.use('microsoft', strategies.microsoft(models));

	registerAuthRoutes(app);

	app.use((req, res, next) =>
		passport.authenticate(['session', 'github', 'google', 'microsoft'], (err, user) => {
			if (err) return void next();
			return void req.login(user, next);
		})(req, res, next)
	);

	// Email unsubscribe link
	app.use('/api/unsubscribe', UnsubscribeHandler(models));

	// Pull events callback
	app.use('/api/manage/events/pull', async (req, res) => {
		const calendar = await pullCalendar(CALENDARID);
		res.send(calendar);
	});

	const server = new ApolloServer({
		context: ({ req }): Context => ({
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
		schema
	});

	server.applyMiddleware({ app });

	if (NODE_ENV !== 'development') {
		logger.info('Setting routing to prod assets.');
		// Serve front-end asset files in prod.
		app.use(express.static('dist/server/app'));
		// MUST BE LAST AS THIS WILL REROUTE ALL REMAINING TRAFFIC TO THE FRONTEND!
		app.use((req, res) => {
			res.sendFile('index.html', { root: 'dist/server/app' });
		});
	}

	app.listen(
		{ port: PORT },
		() => void logger.info(`Server ready at http://localhost:${PORT}${server.graphqlPath}`)
	);
})();

// for testing
export default app;
