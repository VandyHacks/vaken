import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import {
	HackersQuery,
	HackersDocument,
	UserQuery,
	UserDocument,
	UserQueryVariables,
} from './generated.graphql';

const { GATEWAY_BEARER_TOKEN } = process.env;
if (!GATEWAY_BEARER_TOKEN) {
	console.warn(
		'GATEWAY_BEARER_TOKEN not set. Bearer token auth will be disabled. This ' +
			'will adversely affect the resume dump url service.'
	);
}

const link = createHttpLink({
	uri: `http://localhost:${process.env.PORT}/graphql`,
	credentials: 'same-origin',
	fetch,
	headers: {
		Authorization: GATEWAY_BEARER_TOKEN ? `Bearer: ${GATEWAY_BEARER_TOKEN}` : '',
	},
});
const nonCachingClient = new ApolloClient({
	link,
	cache: new InMemoryCache({ resultCacheMaxSize: 0 }),
});

export type HackersQueryResult = HackersQuery['users'] | null;
export async function getHackers(): Promise<HackersQueryResult> {
	try {
		const result = await nonCachingClient.query({ query: HackersDocument });
		return result.data?.users ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}

export type UserQueryResult = UserQuery['user'] | null;
export async function getUser(args: UserQueryVariables): Promise<UserQueryResult> {
	try {
		const result = await nonCachingClient.query({ query: UserDocument, variables: args });
		return result.data?.user ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}
