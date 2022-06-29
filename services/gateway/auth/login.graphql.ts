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
