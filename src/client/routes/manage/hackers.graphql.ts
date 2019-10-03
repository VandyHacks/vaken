import { gql } from 'apollo-boost';

export default gql`
	query detailedHacker($id: ID!) {
		hacker(id: $id) {
			id
			email
			firstName
			preferredName
			lastName
			shirtSize
			gender
			dietaryRestrictions
			userType
			phoneNumber
			race
			modifiedAt
			status
			school
			gradYear
			majors
			adult
			volunteer
			github
			team {
				id
				name
				memberIds
			}
			application {
				question
				answer
			}
		}
	}

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
