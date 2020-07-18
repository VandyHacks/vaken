import gql from 'graphql-tag';

export default gql`
	query me {
		me {
			id
			firstName
			lastName
			userType
			email
			address1
			address2
			city
			state
			zip
		}
	}
`;
