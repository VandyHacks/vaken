import { gql } from '@apollo/client';

export default gql`
	query me {
		me {
			id
			firstName
			lastName
			userType
			email
		}
	}
`;
