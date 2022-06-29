import { gql } from '@apollo/client';

export default gql`
	query Hackers {
		users(first: 10000, filter: APPLICATION_SUBMITTED) {
			id
			email
		}
	}

	query User($id: ID!, $idType: IdType = PRIMARY) {
		user(id: $id, idType: $idType) {
			id
			email
		}
	}
`;
