import gql from 'graphql-tag';

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
				application {
					question
					answer
				}
			}
		}
	}
`;
