import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import express from 'express';
import passport from 'passport';
import session from 'express-session';
import gqlSchema from '../common/schema.graphql';
import { resolvers } from './resolvers';
import DB from './models';
import Context from './context';
import logger from './logger';
import { strategies, registerAuthRoutes } from './auth';

const { SESSION_SECRET, SERVER_PORT } = process.env;
if (!SESSION_SECRET) throw new Error(`SESSION_SECRET not set`);
if (!SERVER_PORT) throw new Error(`SERVER_PORT not set`);

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

	// Register auth functions
	app.use(session({ secret: SESSION_SECRET }));
	app.use(passport.initialize());
	app.use(passport.session());
	passport.use('github', strategies.github(models));
	passport.use('google', strategies.google(models));

	registerAuthRoutes(app);

	app.use((req, res, next) =>
		passport.authenticate(['session', 'github', 'google'], (err, user) => {
			if (err) return void next();
			return void req.login(user, next);
		})(req, res, next)
	);

	const server = new ApolloServer({
		context: ({ req }): Context => ({
			models,
			user: req.user,
		}),
		formatError: error => {
			logger.error(error);
			return error;
		},
		playground: true,
		schema,
	});

	server.applyMiddleware({ app });

	app.listen(
		{ port: SERVER_PORT },
		() => void logger.info(`Server ready at http://localhost:8080${server.graphqlPath}`)
	);
})();

// for testing
export default app;
