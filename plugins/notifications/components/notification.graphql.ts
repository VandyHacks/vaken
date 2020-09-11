import gql from 'graphql-tag';

export default gql`
	mutation _Plugin__createNotification($input: _Plugin__NotificationInput!) {
		_Plugin__createNotification(input: $input) {
			id
		}
	}
`;
