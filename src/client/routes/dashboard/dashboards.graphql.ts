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
`;
