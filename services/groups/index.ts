import { ApolloServer } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { MongoClient } from 'mongodb';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { applyMiddleware } from 'graphql-middleware';
import { Resolvers } from './lib/generated.graphql';
import { typeDefs } from './groups.graphql';
import { Groups } from './lib/groups';
import { notEmpty } from '../../common/util/predicates';
import { permissions } from './permissions';
import { SharedApolloConfig, CommonContext } from '../common/client';

export type GroupsContext = CommonContext & {
	dataSources: {
		groups: Groups;
	};
};

const resolvers: Resolvers<GroupsContext> = {
	Query: {
		group(_, args, { dataSources }) {
			return dataSources.groups.getGroup(args.groupId);
		},
		groups(_, args, { dataSources }) {
			return dataSources.groups.getGroups(args);
		},
	},
	Mutation: {
		async addUserToGroup(_, args, { dataSources }) {
			await dataSources.groups.addUserToGroup(args);
			return { __typename: 'User', id: args.userId };
		},
		createGroup(_, args, { dataSources }) {
			return dataSources.groups.createGroup(args);
		},
		setGroupRoles(_, args, { dataSources }) {
			return dataSources.groups.setGroupRoles(args);
		},
		async removeUserFromGroup(_, args, { dataSources }) {
			await dataSources.groups.removeUserFromGroup(args);
			return { __typename: 'User', id: args.userId };
		},
	},
	User: {
		async roles(user, _, { dataSources }) {
			const groups = await dataSources.groups.getGroupsForUser(user.id);
			if (!groups?.length) return user.selfRoles ?? [];

			const groupRoles = groups.flatMap(group => group.roles).filter(notEmpty) ?? [];
			const antiRoles = groups.flatMap(group => group.antiRoles) ?? [];
			const grantedRoles = groupRoles
				.concat(user.selfRoles ?? [])
				.filter(role => !antiRoles.includes(role));

			return Array.from(new Set(grantedRoles));
		},
		groups(user, _, { dataSources }) {
			return dataSources.groups.getGroupsForUser(user.id);
		},
	},
};

export class GroupsService extends ApolloServer {
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
				groups: new Groups(client.db('vaken').collection('groups')),
			}),
			...config,
		});
	}
}
