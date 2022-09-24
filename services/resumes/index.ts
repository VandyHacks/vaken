import { ApolloServer } from 'apollo-server-express';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { applyMiddleware } from 'graphql-middleware';
import { Resolvers } from './lib/generated.graphql';
import { typeDefs } from './resumes.graphql';
import * as GCS from './lib/google_cloud_storage';
import { MongoClient } from 'mongodb';
import { SharedApolloConfig, CommonContext } from '../common/client';
import { permissions } from './permissions';

export type ResumesContext = CommonContext;

const resolvers: Resolvers<ResumesContext> = {
	Application: {
		resumeFilename: ({ userId }) => GCS.getFilename(userId),
		resumeUrl: ({ userId }) => GCS.getSignedReadUrl(userId),
	},
	Mutation: {
		fileUploadUrl: (_, args) =>
			GCS.getSignedUploadUrl(args.userId, args.filename, args.contentType),
		resumeDumpUrl: GCS.getResumeDumpUrl,
	},
};

export class ResumesService extends ApolloServer {
	constructor(mongo: MongoClient, config: SharedApolloConfig) {
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
		});
	}
}
