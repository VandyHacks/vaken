import { gql } from '@apollo/client';

export default gql`
	query meSponsor {
		me {
			id
			firstName
			lastName
			userType
			email
			... on Sponsor {
				company {
					tier {
						permissions
					}
				}
			}
		}
	}

	query tiers {
		tiers {
			id
			name
			permissions
		}
	}

	query companies {
		companies {
			id
			name
			tier {
				id
				name
				permissions
			}
		}
	}

	mutation sponsorStatus($input: SponsorStatusInput!) {
		sponsorStatus(input: $input) {
			id
			status
		}
	}

	mutation createSponsor($input: SponsorInput!) {
		createSponsor(input: $input) {
			id
			email
		}
	}

	mutation createTier($input: TierInput!) {
		createTier(input: $input) {
			name
			permissions
		}
	}

	mutation createCompany($input: CompanyInput!) {
		createCompany(input: $input) {
			name
			tier {
				name
			}
		}
	}
`;
