import gql from 'graphql-tag';

export default gql`
	query events {
		events {
			id
			name
			eventType
			startTimestamp
			owner {
				id
				name
			}
		}
	}

	mutation addOrUpdateEvent($input: EventUpdateInput!) {
		addOrUpdateEvent(input: $input) {
			id
			name
		}
	}

	mutation assignEventToCompany($input: AssignSponsorEventInput!) {
		assignEventToCompany(input: $input) {
			id
			name
		}
	}
`;
