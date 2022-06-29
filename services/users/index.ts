import { ApolloServer } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { MongoClient } from 'mongodb';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { applyMiddleware } from 'graphql-middleware';
import { Resolvers, Role } from './lib/generated.graphql';
import { typeDefs } from './users.graphql';
import { Users } from './lib/users';
import { permissions } from './permissions';

export type UsersContext = {
	dataSources: {
		users: Users;
	};
	user?: { id: string; roles: Role[] } | null;
	bearerToken?: string;
};

const resolvers: Resolvers<UsersContext> = {
	Query: {
		user(_, args, { dataSources }) {
			return dataSources.users.getUser(args.id);
		},
		users(_, args, { dataSources }) {
			return dataSources.users.getUsers(args);
		},
		loggedInUser(_, __, { dataSources, user }) {
			return user ? dataSources.users.getUser(user.id) : null;
		},
	},
	User: {
		// Reference resolver links the main graph to subgraphs
		__resolveReference(userRepresentation, { dataSources }) {
			return dataSources.users.getUser(userRepresentation.id);
		},
	},
	Mutation: {
		logInUser(_, args, { dataSources }) {
			return dataSources.users.logInUser(args);
		},
	},
};

async function main(): Promise<void> {
	const vakenDb = (
		await MongoClient.connect(process.env.MONGODB_BASE_URL ?? 'mongodb://localhost:27017')
	).db('vaken');

	const server = new ApolloServer({
		schema: applyMiddleware(
			buildSubgraphSchema([
				DIRECTIVES,
				{
					typeDefs,
					resolvers,
				},
			]),
			permissions
		),
		dataSources: () => ({
			users: new Users(vakenDb.collection('users')),
		}),
		cache: 'bounded',
		csrfPrevention: true,
		context: ({ req }) => {
			const user = typeof req.headers.user === 'string' ? JSON.parse(req.headers.user) : null;
			const bearerToken = req.headers.authorization?.match(/Bearer: (.*)$/)?.[1];
			return { user, bearerToken };
		},
	});

	server
		.listen({ port: 4001 })
		// eslint-disable-next-line promise/always-return
		.then(({ url }) => {
			console.log(`User service ready at ${url}`);
		})
		.catch(console.error);
}
main();
