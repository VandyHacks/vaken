import { ApolloServer, makeExecutableSchema } from 'apollo-server-express';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import express from 'express';
import passport from 'passport';
import gqlSchema from '../common/schema.graphql';
import { resolvers } from './resolvers';
import modelsPromise from './models';
import Context from './context';
import logger from './logger';
import { strategies, registerAuthRoutes } from './auth';

const app = express();

app.use(passport.initialize());
passport.use('github', strategies.github);
passport.use('google', strategies.google);

registerAuthRoutes(app);

app.use('/graphql', (req, res, next) => {
	passport.authenticate(['google', 'github'], (err, user) => {
		if (user) {
			req.user = user;
		}

		next();
	})(req, res, next);
});

const schema = makeExecutableSchema({
	resolverValidationOptions: {
		requireResolversForAllFields: true,
		requireResolversForResolveType: false,
	},
	resolvers: resolvers as {},
	typeDefs: [DIRECTIVES, gqlSchema],
});

(async () => {
	const models = await modelsPromise;
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
		schema: schema,
	});

	server.applyMiddleware({ app });

	app.listen(
		{ port: 8080 },
		() => void logger.info(`Server ready at http://localhost:8080${server.graphqlPath}`)
	);
})();
