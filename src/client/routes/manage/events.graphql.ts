import gql from 'graphql-tag';

export default gql`
	query events {
		events {
			id
			name
			owner {
				name
			}
		}
	}
`;
