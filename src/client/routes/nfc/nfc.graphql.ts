import { gql } from '@apollo/client';

export default gql`
	mutation registerNFCUIDWithUser($input: NFCRegisterInput!) {
		registerNFCUIDWithUser(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation checkInUserToEvent($input: EventCheckInInput!) {
		checkInUserToEvent(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation removeUserFromEvent($input: EventCheckInInput!) {
		removeUserFromEvent(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation checkInUserToEventByNfc($input: EventCheckInInputByNfc!) {
		checkInUserToEventByNfc(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation removeUserFromEventByNfc($input: EventCheckInInputByNfc!) {
		removeUserFromEventByNfc(input: $input) {
			id
			firstName
			lastName
		}
	}
`;
