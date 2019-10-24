import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
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

const { SESSION_SECRET, PORT, CALENDARID } = process.env;
if (!SESSION_SECRET) throw new Error(`SESSION_SECRET not set`);
if (!PORT) throw new Error(`PORT not set`);

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

	// Email unsubscribe link
	app.use('/api/unsubscribe', UnsubscribeHandler(models));

	// Register auth functions
	app.use(
		session({
			secret: SESSION_SECRET,
			store: new (MongoStore(session))(({
				clientPromise: dbClient.client,
			} as unknown) as MongoUrlOptions),
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
			return error;
		},
		playground: true,
		schema,
	});

	server.applyMiddleware({ app });

	if (process.env.NODE_ENV === 'production') {
		// Serve front-end asset files in prod.
		app.use(express.static('dist/server/app'));
		// MUST BE LAST AS THIS WILL REROUTE ALL REMAINING TRAFFIC TO THE FRONTEND!
		app.use((req, res) => res.sendFile('index.html', { root: 'dist/server/app' }));
	}

	app.listen(
		{ port: PORT },
		() => void logger.info(`Server ready at http://localhost:8080${server.graphqlPath}`)
	);
})();

// for testing
export default app;
