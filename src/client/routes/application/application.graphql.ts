import { gql } from '@apollo/client';

export default gql`
	mutation signedUploadUrl($input: ID!) {
		signedUploadUrl(input: $input)
	}

	query signedReadUrl($input: ID!) {
		signedReadUrl(input: $input)
	}

	mutation updateMyApplication($input: UpdateMyAppInput!) {
		updateMyApplication(input: $input) {
			id
			... on Hacker {
				application {
					question
					answer
				}
				status
			}
		}
	}

	query myApplication {
		me {
			id
			... on Hacker {
				status
				application {
					question
					answer
				}
			}
		}
	}
`;
