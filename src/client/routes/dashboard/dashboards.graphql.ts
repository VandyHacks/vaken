import gql from 'graphql-tag';

export default gql`
	query myStatus {
		me {
			id
			... on Hacker {
				status
			}
		}
	}

	mutation confirmMySpot {
		confirmMySpot {
			id
			... on Hacker {
				status
			}
		}
	}

	mutation declineMySpot {
		declineMySpot {
			id
			... on Hacker {
				status
			}
		}
	}
`;
