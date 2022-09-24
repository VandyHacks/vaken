import { NON_CACHING_CLIENT } from '../../common/client';
import {
	LogInUserDocument,
	LogInUserMutation,
	UserSessionDocument,
	UserSessionQuery,
} from './generated.graphql';
import { gql } from '@apollo/client';

export default gql`
	mutation logInUser($email: String!, $provider: String!, $token: String!) {
		logInUser(email: $email, provider: $provider, token: $token) {
			id
		}
	}

	query userSession($id: ID!) {
		user(id: $id) {
			id
			email
			roles
		}
	}
`;

export type LogInUserResult = LogInUserMutation['logInUser'] | null;
export async function logInUser(args: {
	email: string;
	provider: string;
	token: string;
}): Promise<LogInUserResult> {
	try {
		const result = await NON_CACHING_CLIENT.mutate({
			mutation: LogInUserDocument,
			variables: args,
		});
		return result.data?.logInUser ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}

export type UserSessionResult = UserSessionQuery['user'] | null;
export async function getUser(userId: string): Promise<UserSessionResult> {
	try {
		const result = await NON_CACHING_CLIENT.query({
			query: UserSessionDocument,
			variables: { id: userId },
		});
		return result.data?.user ?? null;
	} catch (e: unknown) {
		console.error(JSON.stringify(e));
		return null;
	}
}
