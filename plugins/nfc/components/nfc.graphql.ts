import { gql } from '@apollo/client';

export default gql`
	mutation _Plugin__registerNFCUIDWithUser($input: _Plugin__NFCRegisterInput!) {
		_Plugin__registerNFCUIDWithUser(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation _Plugin__checkInUserToEvent($input: _Plugin__EventCheckInInput!) {
		_Plugin__checkInUserToEvent(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation _Plugin__removeUserFromEvent($input: _Plugin__EventCheckInInput!) {
		_Plugin__removeUserFromEvent(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation _Plugin__checkInUserToEventByNfc($input: _Plugin__EventCheckInInputByNfc!) {
		_Plugin__checkInUserToEventByNfc(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation _Plugin__removeUserFromEventByNfc($input: _Plugin__EventCheckInInputByNfc!) {
		_Plugin__removeUserFromEventByNfc(input: $input) {
			id
			firstName
			lastName
		}
	}
`;
