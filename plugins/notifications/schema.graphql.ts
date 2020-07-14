import gql from 'graphql-tag';

export default gql`
	type _Plugin__Notification @entity {
		id: ID! @id @column
		message: String! @column
		userTypes: [UserType!]! @column
		platforms: [_Plugin__Platform!]! @column
		deliveryTime: Float! @column(overrideType: "Date")
		subject: String @column
	}

	enum _Plugin__Platform {
		SLACK
		DISCORD
		EMAIL
		WEBSITE
	}

	extend type Query {
		_Plugin__notification(id: ID!): _Plugin__Notification!
		_Plugin__notifications(sortDirection: SortDirection): [_Plugin__Notification!]!
	}

	input _Plugin__NotificationInput {
		message: String!
		userTypes: [UserType!]!
		platforms: [_Plugin__Platform!]!
		deliveryTime: Float!
		subject: String
	}

	extend type Mutation {
		_Plugin__createNotification(input: _Plugin__NotificationInput!): _Plugin__Notification!
	}
`;
