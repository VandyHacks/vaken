import { gql } from 'apollo-boost';

export default gql`
	query myProfile {
		me {
			id
			firstName
			lastName
			email
			preferredName
			shirtSize
			gender
			dietaryRestrictions
			phoneNumber
		}
	}

	mutation updateMyProfile($input: UserInput!) {
		updateMyProfile(input: $input) {
			id
			firstName
			lastName
			email
			preferredName
			shirtSize
			gender
			dietaryRestrictions
			phoneNumber
		}
	}
`;
