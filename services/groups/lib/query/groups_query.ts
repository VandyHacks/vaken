import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'cross-fetch';
import {
	GroupDocument,
	GroupQuery,
	GroupQueryVariables,
	UserQuery,
	UserDocument,
	UserQueryVariables,
	IdType,
} from './generated.graphql';

const { GATEWAY_BEARER_TOKEN } = process.env;
if (!GATEWAY_BEARER_TOKEN) {
	console.warn(
		'GATEWAY_BEARER_TOKEN not set. Bearer token auth will be disabled. This ' +
			'will adversely affect the groups service.'
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

export type GroupQueryResult = GroupQuery['group'] | null;
export async function getGroup(args: GroupQueryVariables): Promise<GroupQueryResult> {
	try {
		const result = await nonCachingClient.query({ query: GroupDocument, variables: args });
		return result.data?.group ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}

export type UserQueryResult = UserQuery['user'] | null;
export async function getUser(args: UserQueryVariables): Promise<UserQueryResult> {
	if (args.userIdType === IdType.Primary) {
		return { __typename: 'User', id: args.userId };
	}

	try {
		const result = await nonCachingClient.query({ query: UserDocument, variables: args });
		return result.data?.user ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}
