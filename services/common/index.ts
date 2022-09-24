import { Config, ExpressContext } from 'apollo-server-express';
import { Role } from '../../common/types/generated';
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';

export type SharedApolloConfig = Readonly<Omit<Config<ExpressContext>, 'schema' | 'dataSources'>>;
export const DEFAULT_APOLLO_CONFIG: SharedApolloConfig = {
	cache: 'bounded',
	csrfPrevention: true,
	introspection: true,
	context: ({ req }) => {
		const user = typeof req.headers.user === 'string' ? JSON.parse(req.headers.user) : null;
		const bearerToken = req.headers.authorization?.match(/Bearer: (.*)$/)?.[1];
		return { user, bearerToken };
	},
};

export interface CommonContext {
	user?: { id: string; roles: Role[] } | null;
	bearerToken?: string;
}

const { GATEWAY_BEARER_TOKEN } = process.env;
const LOOPBACK_APOLLO_LINK = createHttpLink({
	uri: `http://localhost:${process.env.PORT}/graphql`,
	credentials: 'same-origin',
	fetch,
	headers: {
		Authorization: GATEWAY_BEARER_TOKEN ? `Bearer: ${GATEWAY_BEARER_TOKEN}` : '',
	},
});
/**
 * Apollo client used to query the supergraph.
 */
export const NON_CACHING_CLIENT = new ApolloClient({
	link: LOOPBACK_APOLLO_LINK,
	cache: new InMemoryCache({ resultCacheMaxSize: 0 }),
});
