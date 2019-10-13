import { gql } from 'apollo-boost';

export default gql`
	query sponsor {
		me {
			id
			email
		}
	}

	mutation sponsorStatus($input: SponsorStatusInput!) {
		sponsorStatus(input: $input) {
			id
			status
		}
	}

	mutation createSponsor($input: createSponsorInput!) {
		createSponsor(input: $input) {
			id
			email
		}
	}
`;
