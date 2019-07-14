import { gql } from 'apollo-boost';

export default gql`
	mutation updateMyApplication($input: [ApplicationInput!]!) {
		updateMyApplication(input: $input) {
			id
			... on Hacker {
				application {
					question
					answer
				}
			}
		}
	}
	query myApplication {
		me {
			id
			... on Hacker {
				application {
					question
					answer
				}
			}
		}
	}
`;
