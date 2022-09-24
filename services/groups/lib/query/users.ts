import { gql } from '@apollo/client';
import { NON_CACHING_CLIENT } from '../../../common';
import { UserQuery, UserDocument, UserQueryVariables, IdType } from './generated.graphql';

export default gql`
	query User($userId: ID!, $userIdType: IdType!) {
		user(id: $userId, idType: $userIdType) {
			id
		}
	}
`;

export type UserQueryResult = UserQuery['user'] | null;
export async function getUser(args: UserQueryVariables): Promise<UserQueryResult> {
	if (args.userIdType === IdType.Primary) {
		return { __typename: 'User', id: args.userId };
	}

	try {
		const result = await NON_CACHING_CLIENT.query({ query: UserDocument, variables: args });
		return result.data?.user ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}
