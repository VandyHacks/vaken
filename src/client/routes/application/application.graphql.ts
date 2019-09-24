import { gql } from 'apollo-boost';

export default gql`
	mutation signedUploadUrl($input: ID!) {
		signedUploadUrl(input: $input)
	}

	query signedReadUrl($input: ID!) {
		signedReadUrl(input: $input)
	}

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
