import {
	ApolloGateway,
	IntrospectAndCompose,
	RemoteGraphQLDataSource,
	ServiceEndpointDefinition,
} from '@apollo/gateway';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault as graphQLSandboxPlugin } from 'apollo-server-core';
import { serializeQueryPlan } from '@apollo/query-planner';
import { GATEWAY_BEARER_TOKEN } from '../common/env';
import { SharedApolloConfig } from '../common/client';

export class GatewayService extends ApolloServer {
	constructor(subgraphs: ServiceEndpointDefinition[], config: SharedApolloConfig) {
		const gateway = new ApolloGateway({
			experimental_didResolveQueryPlan(options) {
				if (options.requestContext.operationName !== 'IntrospectionQuery') {
					console.log(serializeQueryPlan(options.queryPlan));
				}
			},
			supergraphSdl: new IntrospectAndCompose({
				subgraphs,
				introspectionHeaders: {
					Authorization: GATEWAY_BEARER_TOKEN ? `Bearer: ${GATEWAY_BEARER_TOKEN}` : '',
				},
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
						if (context.bearerToken) {
							request.http?.headers.set('Authorization', `Bearer: ${context.bearerToken}`);
						}
					},
				});
			},
		});

		super({
			gateway,
			plugins: [graphQLSandboxPlugin({ embed: true })],
			...config,
		});
	}
}
