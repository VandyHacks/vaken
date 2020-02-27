import gql from 'graphql-tag';

export default gql`
	mutation __PLUGIN__registerNFCUIDWithUser($input: __PLUGIN__NFCRegisterInput!) {
		__PLUGIN__registerNFCUIDWithUser(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation __PLUGIN__checkInUserToEvent($input: __PLUGIN__EventCheckInInput!) {
		__PLUGIN__checkInUserToEvent(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation __PLUGIN__removeUserFromEvent($input: __PLUGIN__EventCheckInInput!) {
		__PLUGIN__removeUserFromEvent(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation __PLUGIN__checkInUserToEventByNfc($input: __PLUGIN__EventCheckInInputByNfc!) {
		__PLUGIN__checkInUserToEventByNfc(input: $input) {
			id
			firstName
			lastName
		}
	}

	mutation __PLUGIN__removeUserFromEventByNfc($input: __PLUGIN__EventCheckInInputByNfc!) {
		__PLUGIN__removeUserFromEventByNfc(input: $input) {
			id
			firstName
			lastName
		}
	}
`;
