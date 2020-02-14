import gql from 'graphql-tag';


export default gql`
  type __PLUGIN__Event @entity {
    id: ID! @id @column
    name: String! @column
    startTimestamp: Float! @column(overrideType: "Date")
    duration: Int! @column
    attendees: [ID!]! @column
    checkins: [__PLUGIN__EventCheckIn!]! @embedded
    warnRepeatedCheckins: Boolean! @column
    description: String @column
    location: String! @column
    eventType: String! @column
    gcalID: String @column
    owner: Company @embedded
  }

  type __PLUGIN__EventCheckIn @entity(embedded: true) {
    id: ID! @id @column
    user: String! @column
    timestamp: Int! @column(overrideType: "Date")
  }

  type Query {
    __PLUGIN__event(id: ID!): __PLUGIN__Event!
		__PLUGIN__events(sortDirection: SortDirection): [__PLUGIN__Event!]!
		__PLUGIN__eventCheckIn(id: ID!): __PLUGIN__EventCheckIn!
    __PLUGIN__eventCheckIns(sortDirection: SortDirection): [__PLUGIN__EventCheckIn!]!
  }

  input __PLUGIN__EventCheckInInput {
    user: ID!
    event: ID!
  }

  input __PLUGIN__EventCheckInInputByNfc {
    nfcId: String!
    event: ID!
  }

  input __PLUGIN__NFCRegisterInput {
    nfcid: ID!
    user: ID!
  }

  type Mutation {
    __PLUGIN__checkInUserToEvent(input: __PLUGIN__EventCheckInInput!): User!
    __PLUGIN__removeUserFromEvent(input: __PLUGIN__EventCheckInInput!): User!
    __PLUGIN__registerNFCUIDWithUser(input: __PLUGIN__NFCRegisterInput!): User!
    __PLUGIN__checkInUserToEventByNfc(input: __PLUGIN__EventCheckInInputByNfc!): User!
    __PLUGIN__removeUserFromEventByNfc(input: __PLUGIN__EventCheckInInputByNfc!): User!
  }
`