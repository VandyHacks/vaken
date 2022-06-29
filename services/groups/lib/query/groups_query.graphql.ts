import { gql } from '@apollo/client';

export default gql`
	query Group($id: ID!) {
		group(groupId: $id) {
			id
			members {
				id
			}
		}
	}

	query User($userId: ID!, $userIdType: IdType!) {
		user(id: $userId, idType: $userIdType) {
			id
		}
	}
`;
