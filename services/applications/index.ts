import { ApolloServer } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { MongoClient } from 'mongodb';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { applyMiddleware } from 'graphql-middleware';
import { ApplicationDbObject, IdType, Resolvers, User } from './lib/generated.graphql';
import { typeDefs } from './applications.graphql';
import { Applications } from './lib/applications';
import { getUser } from './lib/query/user';
import { permissions } from './permissions';
import { CommonContext, SharedApolloConfig } from '../common/client';

export type ApplicationsContext = CommonContext & {
	dataSources: {
		applications: Applications;
	};
};

const resolvers: Resolvers<ApplicationsContext> = {
	Application: {
		__resolveReference(applicationReference, { dataSources }) {
			return dataSources.applications.getApplicationForUsers(applicationReference.userId);
		},
	},
	User: {
		async application(user, _, { dataSources }) {
			const application = await dataSources.applications.getApplicationForUsers(user.id);
			return application;
		},
	},
	Mutation: {
		async saveApplication(_, { userId, applicationField, updateStatus }, { dataSources }) {
			const application = await dataSources.applications.saveApplication(userId, applicationField, {
				updateStatus,
			});
			return { id: userId, application };
		},
		async setUserApplicationStatus(_, { userId, userIdType, applicationStatus }, { dataSources }) {
			const primaryUserIds =
				userIdType === IdType.Primary
					? userId
					: (await Promise.all(userId.map(id => getUser({ id, idType: userIdType }))))
							.filter((user): user is User => !!user)
							.map(user => user?.id);

			await dataSources.applications.setUserApplicationStatus(primaryUserIds, applicationStatus);

			return (await dataSources.applications.getApplicationForUsers(primaryUserIds)).map(
				application => ({
					id: application.userId,
					application,
				})
			);
		},
	},
};

export class ApplicationsService extends ApolloServer {
	constructor(client: MongoClient, config: SharedApolloConfig) {
		const applicationsCollection = client
			.db('vaken')
			.collection<ApplicationDbObject>('applications');
		applicationsCollection.createIndex({ userId: 1 }, { unique: true });

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
			...config,
			dataSources: () => ({
				applications: new Applications(applicationsCollection),
			}),
		});
	}
}
