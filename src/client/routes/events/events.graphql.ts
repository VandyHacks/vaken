import gql from 'graphql-tag';

export default gql`
	query events {
		events {
			id
			name
			eventType
		}
	}

	mutation addOrUpdateEvent($input: EventUpdateInput!) {
		addOrUpdateEvent(input: $input) {
			id
			name
		}
	}
`;
