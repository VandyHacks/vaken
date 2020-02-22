import gql from 'graphql-tag';


export default gql`
  type _PLUGIN__Event @entity {
    id: ID! @id @column
    name: String! @column
    startTimestamp: Float! @column(overrideType: "Date")
    duration: Int! @column
    attendees: [ID!]! @column
    checkins: [_PLUGIN__EventCheckIn!]! @embedded
    warnRepeatedCheckins: Boolean! @column
    description: String @column
    location: String! @column
    eventType: String! @column
    gcalID: String @column
    owner: Company @embedded
  }

  type _PLUGIN__EventCheckIn @entity(embedded: true) {
    id: ID! @id @column
    user: String! @column
    timestamp: Int! @column(overrideType: "Date")
  }

  extend type Query {
    _PLUGIN__event(id: ID!): _PLUGIN__Event!
		_PLUGIN__events(sortDirection: SortDirection): [_PLUGIN__Event!]!
		_PLUGIN__eventCheckIn(id: ID!): _PLUGIN__EventCheckIn!
    _PLUGIN__eventCheckIns(sortDirection: SortDirection): [_PLUGIN__EventCheckIn!]!
  }

  input _PLUGIN__EventCheckInInput {
    user: ID!
    event: ID!
  }

  input _PLUGIN__EventCheckInInputByNfc {
    nfcId: String!
    event: ID!
  }

  input _PLUGIN__NFCRegisterInput {
    nfcid: ID!
    user: ID!
  }

  extend type Mutation {
    _PLUGIN__checkInUserToEvent(input: _PLUGIN__EventCheckInInput!): User!
    _PLUGIN__removeUserFromEvent(input: _PLUGIN__EventCheckInInput!): User!
    _PLUGIN__registerNFCUIDWithUser(input: _PLUGIN__NFCRegisterInput!): User!
    _PLUGIN__checkInUserToEventByNfc(input: _PLUGIN__EventCheckInInputByNfc!): User!
    _PLUGIN__removeUserFromEventByNfc(input: _PLUGIN__EventCheckInInputByNfc!): User!
  }
`