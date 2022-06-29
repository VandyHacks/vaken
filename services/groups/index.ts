import { ApolloServer } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { MongoClient, Collection } from 'mongodb';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { applyMiddleware } from 'graphql-middleware';
import { GroupDbObject, Resolvers, Role } from './lib/generated.graphql';
import { typeDefs } from './groups.graphql';
import { Groups } from './lib/groups';
import { notEmpty } from '../../common/util/predicates';
import { permissions } from './permissions';

export type GroupsContext = {
	dataSources: {
		groups: Groups;
	};
	user?: { id: string; roles: Role[] } | null;
	bearerToken?: string;
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

async function main(): Promise<void> {
	const groupsCollection: Collection<GroupDbObject> = (
		await MongoClient.connect(process.env.MONGODB_BASE_URL ?? 'mongodb://localhost:27017')
	)
		.db('vaken')
		.collection('groups');

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
			groups: new Groups(groupsCollection),
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
		.listen({ port: 4002 })
		// eslint-disable-next-line promise/always-return
		.then(({ url }) => {
			console.log(`Groups service ready at ${url}`);
		})
		.catch(console.error);
}
main();
