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

	mutation updateMyProfile($input: UserInputType!) {
		updateMyProfile(input: $input) {
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
