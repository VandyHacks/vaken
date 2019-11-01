import gql from 'graphql-tag';

export default gql`
	query events {
		events {
			id
			name
			eventType
			startTimestamp
			duration
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

	mutation removeAbsentEvents($input: IdListInput!) {
		removeAbsentEvents(input: $input)
	}
`;
