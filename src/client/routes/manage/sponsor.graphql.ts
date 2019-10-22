import gql from 'graphql-tag';

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
`;
