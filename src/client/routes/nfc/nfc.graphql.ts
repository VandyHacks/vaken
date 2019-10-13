import gql from 'graphql-tag';

export default gql`
	query events {
		events {
			id
			name
			eventType
		}
	}

	mutation registerNFCUIDWithUser($input: NFCRegisterInput!) {
		registerNFCUIDWithUser(input: $input)
	}

	mutation checkInUserToEvent($input: EventCheckInInput!) {
		checkInUserToEvent(input: $input)
	}

	mutation removeUserFromEvent($input: EventCheckInInput!) {
		removeUserFromEvent(input: $input)
	}

	mutation checkInUserToEventByNfc($input: EventCheckInInputByNfc!) {
		checkInUserToEventByNfc(input: $input)
	}

	mutation removeUserFromEventByNfc($input: EventCheckInInputByNfc!) {
		removeUserFromEventByNfc(input: $input)
	}
`;
