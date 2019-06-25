import { ApolloServer, makeExecutableSchema } from 'apollo-server-koa';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import Koa from 'koa';
import pino from 'pino';
import gqlSchema from '../common/schema.graphql';
import { resolvers } from './resolvers';
import { initDb } from './collections';
import Context from './context';

(async () => {
	const models = await initDb();
	const logger = pino();

	const context: Context = {
		models,
	};

	const schema = makeExecutableSchema({
		resolverValidationOptions: {
			requireResolversForAllFields: true,
			requireResolversForResolveType: false,
		},
		resolvers: resolvers as {},
		typeDefs: [DIRECTIVES, gqlSchema],
	});

	const server = new ApolloServer({
		context: context,
		formatError: error => {
			logger.error(error);
			return error;
		},
		playground: true,
		schema: schema,
	});

	const app = new Koa();
	server.applyMiddleware({ app });

	app.listen(
		{ port: 8080 },
		() => void logger.info(`Server ready at http://localhost:8080${server.graphqlPath}`)
	);
})();
