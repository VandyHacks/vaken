import { gql } from 'apollo-boost';

export default gql`
	query eventsNames {
		events {
			id
			name
		}
	}
`;
