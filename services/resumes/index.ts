import { ApolloServer } from 'apollo-server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import { MongoClient } from 'mongodb';
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb';
import { applyMiddleware } from 'graphql-middleware';
import { Role } from '../../common/types/generated';
import { Resolvers } from './lib/generated.graphql';
import { typeDefs } from './resumes.graphql';
import * as GCS from './lib/google_cloud_storage';
// import { permissions } from './permissions';

export type ResumesContext = {
	user?: { id: string; roles: Role[] } | null;
	bearerToken?: string;
};

const resolvers: Resolvers<ResumesContext> = {
	Application: {
		resumeFilename: () => null,
		resumeUrl: () => null,
	},
	Mutation: {
		fileUploadUrl: () => null,
		resumeDumpUrl: () => null,
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
