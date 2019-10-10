import gql from 'graphql-tag';

export default gql`
	query team {
		me {
			id
			... on Hacker {
				team {
					id
					name
					memberIds
					size
				}
			}
		}
	}

	mutation joinTeam($input: TeamInput!) {
		joinTeam(input: $input) {
			id
			... on Hacker {
				team {
					id
					name
					memberIds
					size
				}
			}
		}
	}

	mutation leaveTeam {
		leaveTeam {
			id
			... on Hacker {
				team {
					id
					name
					memberIds
					size
				}
			}
		}
	}
`;
