import { gql } from 'apollo-boost';

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
