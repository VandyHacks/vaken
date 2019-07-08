import { gql } from 'apollo-boost';

export default gql`
	query hackers {
		hackers {
			id
			firstName
			lastName
			email
			gradYear
			school
			status
		}
	}

	mutation hackerStatus($input: HackerStatusInput!) {
		hackerStatus(input: $input) {
			id
			status
		}
	}

	mutation hackerStatuses($input: HackerStatusesInput!) {
		hackerStatuses(input: $input) {
			id
			status
		}
	}
`;
