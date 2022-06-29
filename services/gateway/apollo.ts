import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { serializeQueryPlan } from '@apollo/query-planner';

const gateway = new ApolloGateway({
	// experimental_didResolveQueryPlan(options) {
	// 	if (options.requestContext.operationName !== 'IntrospectionQuery') {
	// 		console.log(serializeQueryPlan(options.queryPlan));
	// 	}
	// },
	supergraphSdl: new IntrospectAndCompose({
		subgraphs: [
			{ name: 'users', url: 'http://localhost:4001' },
			{ name: 'groups', url: 'http://localhost:4002' },
		],
	}),
	// This context magic populates the user from the apollo context into the
	// request headers for downstream services, so the logged in user may be
	// accessed in each subgraph. It must be explicitly extracted from the
	// request headers in each subgraph that needs it.
	buildService({ url }) {
		return new RemoteGraphQLDataSource({
			url,
			willSendRequest({ request, context }) {
				if (context.user) {
					request.http?.headers.set('user', JSON.stringify(context.user));
				}
				if (context.authorizationHeader) {
					request.http?.headers.set('Authorization', context.authorizationHeader);
				}
			},
		});
	},
});

export const apolloServer = new ApolloServer({
	gateway,
	cache: 'bounded',
	csrfPrevention: true,
	introspection: process.env.NODE_ENV !== 'production',
	// This context magic populates the user in the apollo context, so it can be
	// passed through the gateway to downstream subgraphs.
	context: ({ req }) => ({
		user: req.user,
		authorizationHeader: req.headers.authorization,
	}),
	plugins:
		process.env.NODE_ENV === 'production'
			? []
			: [ApolloServerPluginLandingPageLocalDefault({ embed: true })],
});
