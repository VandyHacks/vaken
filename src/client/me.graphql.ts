import { gql } from 'apollo-boost';

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
