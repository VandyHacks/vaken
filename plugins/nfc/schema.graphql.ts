import gql from 'graphql-tag';

export default gql`
	type _Plugin__Event @entity {
		id: ID! @id @column
		name: String! @column
		startTimestamp: Float! @column(overrideType: "Date")
		duration: Int! @column
		attendees: [ID!]! @column
		checkins: [_Plugin__EventCheckIn!]! @embedded
		warnRepeatedCheckins: Boolean! @column
		description: String @column
		location: String! @column
		eventType: String! @column
		gcalID: String @column
	}

	type _Plugin__EventCheckIn @entity(embedded: true) {
		id: ID! @id @column
		user: String! @column
		timestamp: Int! @column(overrideType: "Date")
	}

	extend type Query {
		_Plugin__event(id: ID!): _Plugin__Event!
		_Plugin__events(sortDirection: SortDirection): [_Plugin__Event!]!
		_Plugin__eventCheckIn(id: ID!): _Plugin__EventCheckIn!
		_Plugin__eventCheckIns(sortDirection: SortDirection): [_Plugin__EventCheckIn!]!
	}

	input _Plugin__EventCheckInInput {
		user: ID!
		event: ID!
	}

	input _Plugin__EventCheckInInputByNfc {
		nfcId: String!
		event: ID!
	}

	input _Plugin__NFCRegisterInput {
		nfcid: ID!
		user: ID!
	}

	extend type Mutation {
		_Plugin__checkInUserToEvent(input: _Plugin__EventCheckInInput!): User!
		_Plugin__removeUserFromEvent(input: _Plugin__EventCheckInInput!): User!
		_Plugin__registerNFCUIDWithUser(input: _Plugin__NFCRegisterInput!): User!
		_Plugin__checkInUserToEventByNfc(input: _Plugin__EventCheckInInputByNfc!): User!
		_Plugin__removeUserFromEventByNfc(input: _Plugin__EventCheckInInputByNfc!): User!
	}
`;
