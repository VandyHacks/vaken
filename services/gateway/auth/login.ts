import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import {
	LogInUserDocument,
	LogInUserMutation,
	UserSessionDocument,
	UserSessionQuery,
} from './generated.graphql';

const { GATEWAY_BEARER_TOKEN } = process.env;
if (!GATEWAY_BEARER_TOKEN) {
	console.warn(
		'GATEWAY_BEARER_TOKEN not set. Bearer token auth will be disabled. This ' +
			'will adversely affect the logInUser mutation.'
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
const cachingClient = new ApolloClient({
	link,
	cache: new InMemoryCache(),
});

export type LogInUserResult = LogInUserMutation['logInUser'] | null;
export async function logInUser(args: {
	email: string;
	provider: string;
	token: string;
}): Promise<LogInUserResult> {
	try {
		const result = await nonCachingClient.mutate({ mutation: LogInUserDocument, variables: args });
		return result.data?.logInUser ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}

export type UserSessionResult = UserSessionQuery['user'] | null;
export async function getUser(userId: string): Promise<UserSessionResult> {
	try {
		const result = await cachingClient.query({
			query: UserSessionDocument,
			variables: { id: userId },
		});
		return result.data?.user ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}
