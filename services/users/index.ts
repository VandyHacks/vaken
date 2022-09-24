import { ApolloServer } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { MongoClient } from 'mongodb';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { applyMiddleware } from 'graphql-middleware';
import { Resolvers } from './lib/generated.graphql';
import { typeDefs } from './users.graphql';
import { Users } from './lib/users';
import { permissions } from './permissions';
import { CommonContext, SharedApolloConfig } from '../common';

export type UsersContext = CommonContext & {
	dataSources: {
		users: Users;
	};
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

export class UsersService extends ApolloServer {
	constructor(client: MongoClient, config: SharedApolloConfig) {
		super({
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
				users: new Users(client.db('vaken').collection('users')),
			}),
			...config,
		});
	}
}
