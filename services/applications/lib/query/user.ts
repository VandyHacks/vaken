import { UserQuery, UserDocument, UserQueryVariables } from './generated.graphql';
import { NON_CACHING_CLIENT } from '../../../common';
import { gql } from '@apollo/client';

const { GATEWAY_BEARER_TOKEN } = process.env;
if (!GATEWAY_BEARER_TOKEN) {
	console.warn(
		'GATEWAY_BEARER_TOKEN not set. Bearer token auth will be disabled. This ' +
			'will adversely affect the applications service.'
	);
}

/** GraphQL query string for the generated client */
export default gql`
	query User($id: ID!, $idType: IdType = PRIMARY) {
		user(id: $id, idType: $idType) {
			id
		}
	}
`;

export type UserQueryResult = UserQuery['user'] | null;
export async function getUser(args: UserQueryVariables): Promise<UserQueryResult> {
	try {
		const result = await NON_CACHING_CLIENT.query({ query: UserDocument, variables: args });
		return result.data?.user ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}
