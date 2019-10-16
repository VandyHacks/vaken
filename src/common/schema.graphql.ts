import gql from 'graphql-tag';

export default gql`
	interface User @abstractEntity(discriminatorField: "userType") {
		id: ID! @id @column
		createdAt: Float! @column(overrideType: "Date")
		secondaryIds: [ID!]! @column
		logins: [Login!]! @embedded
		email: String! @column
		emailUnsubscribed: Boolean! @column
		firstName: String! @column
		preferredName: String! @column
		lastName: String! @column
		shirtSize: ShirtSize @column
		gender: String @column
		dietaryRestrictions: String! @column
		userType: UserType! @column
		phoneNumber: String @column
		eventsAttended: [ID!]! @column
	}

	enum AuthLevel {
		HACKER
		ORGANIZER
		SPONSOR
	}

	enum DietaryRestriction {
		VEGETARIAN
		VEGAN
		NUT_ALLERGY
		LACTOSE_ALLERGY
		GLUTEN_FREE
		KOSHER
		HALAL
	}

	enum Race {
		WHITE
		BLACK_OR_AFRICAN_AMERICAN
		AMERICAN_INDIAN_OR_ALASKA_NATIVE
		ASIAN
		NATIVE_HAWAIIAN_PACIFIC_ISLANDER
		HISPANIC_OR_LATINO
	}

	enum Gender {
		MALE
		FEMALE
		OTHER
		PREFER_NOT_TO_SAY
	}

	enum ShirtSize {
		XS
		S
		M
		L
		XL
		XXL
	}

	enum ApplicationStatus {
		CREATED
		VERIFIED
		STARTED
		SUBMITTED
		ACCEPTED
		CONFIRMED
		REJECTED
	}

	enum LoginProvider {
		GITHUB
		GOOGLE
		SCHOOL
	}

	enum UserType {
		HACKER
		MENTOR
		ORGANIZER
		SPONSOR
		SUPER_ADMIN
	}

	enum SortDirection {
		ASC
		DESC
	}

	type ApplicationField @entity(embedded: true) {
		id: ID! @column
		createdAt: Float! @column(overrideType: "Date")
		question: String! @column
		answer: String @column
		userId: Hacker! @link @column
	}

	type Login @entity(additionalFields: [{ path: "email", type: "string" }]) {
		createdAt: Float! @column(overrideType: "Date")
		provider: LoginProvider! @column
		token: ID! @column
		userType: UserType! @column
	}

	type Event @entity {
		id: ID! @id @column
		name: String! @column
		startTimestamp: Int! @column(overrideType: "Date")
		duration: Int! @column
		attendees: [ID!]! @column
		checkins: [EventCheckIn!]! @embedded
		warnRepeatedCheckins: Boolean! @column
		description: String @column
		location: String! @column
		eventType: String! @column
	}

	type EventCheckIn @entity(embedded: true) {
		id: ID! @id @column
		user: String! @column
		timestamp: Int! @column(overrideType: "Date")
	}

	type Hacker implements User @entity {
		id: ID!
		createdAt: Float!
		secondaryIds: [ID!]!
		logins: [Login!]!
		email: String!
		firstName: String!
		preferredName: String!
		lastName: String!
		shirtSize: ShirtSize
		gender: String
		dietaryRestrictions: String!
		userType: UserType!
		phoneNumber: String
		race: String! @column
		modifiedAt: Float! @column
		status: ApplicationStatus! @column
		school: String @column
		gradYear: String @column
		majors: [String!]! @column
		adult: Boolean @column
		volunteer: String @column
		github: String @column
		team: Team @embedded
		eventsAttended: [ID!]! @column
		application: [ApplicationField!]! @embedded
		emailUnsubscribed: Boolean! @column
	}

	type Shift @entity(embedded: true) {
		begin: Float! @column(overrideType: "Date")
		end: Float! @column(overrideType: "Date")
	}

	type Mentor implements User @entity {
		id: ID!
		createdAt: Float!
		secondaryIds: [ID!]!
		logins: [Login!]!
		email: String!
		emailUnsubscribed: Boolean! @column
		firstName: String!
		preferredName: String!
		lastName: String!
		shirtSize: ShirtSize
		gender: String
		dietaryRestrictions: String!
		userType: UserType!
		phoneNumber: String
		shifts: [Shift!]! @embedded
		skills: [String!]! @column
		eventsAttended: [ID!]! @column
	}

	type Team @entity(embedded: true) {
		id: ID! @id @column
		createdAt: Float! @column(overrideType: "Date")
		name: String @column
		memberIds: [ID!]! @column
		size: Int!
	}

	type Organizer implements User @entity {
		id: ID!
		createdAt: Float!
		secondaryIds: [ID!]!
		logins: [Login!]!
		email: String!
		emailUnsubscribed: Boolean! @column
		firstName: String!
		preferredName: String!
		lastName: String!
		shirtSize: ShirtSize
		gender: String
		dietaryRestrictions: String!
		userType: UserType!
		phoneNumber: String
		permissions: [String]! @column
		eventsAttended: [ID!]! @column
	}

	type Query {
		me: User # May be used when not logged in.
		hacker(id: ID!): Hacker!
		hackers(sortDirection: SortDirection): [Hacker!]!
		event(id: ID!): Event!
		events(sortDirection: SortDirection): [Event!]!
		eventCheckIn(id: ID!): EventCheckIn!
		eventCheckIns(sortDirection: SortDirection): [EventCheckIn!]!
		organizer(id: ID!): Organizer!
		organizers(sortDirection: SortDirection): [Organizer!]!
		mentor(id: ID!): Mentor!
		mentors(sortDirection: SortDirection): [Mentor!]!
		signedReadUrl(input: ID!): String!
		team(id: ID!): Team!
		teams(sortDirection: SortDirection): [Team!]!
	}

	input UserInput {
		firstName: String
		lastName: String
		email: String
		preferredName: String
		shirtSize: String
		gender: String
		dietaryRestrictions: String
		phoneNumber: String
	}

	input TeamInput {
		name: String!
	}

	input HackerStatusInput {
		id: ID!
		status: ApplicationStatus!
	}

	input HackerStatusesInput {
		ids: [ID!]!
		status: ApplicationStatus!
	}

	input EventCheckInInput {
		user: ID!
		event: ID!
	}

	input NFCRegisterInput {
		nfcid: ID!
		user: ID!
	}

	input ApplicationInput {
		question: String!
		answer: String!
	}

	input UpdateMyAppInput {
		fields: [ApplicationInput!]!
		submit: Boolean
	}

	type Mutation {
		updateMyApplication(input: UpdateMyAppInput!): User!
		updateMyProfile(input: UserInput!): User!
		updateProfile(id: ID!, input: UserInput!): User!
		joinTeam(input: TeamInput!): Hacker!
		leaveTeam: Hacker!
		hackerStatus(input: HackerStatusInput!): Hacker!
		hackerStatuses(input: HackerStatusesInput!): [Hacker!]!
		checkInUserToEvent(input: EventCheckInInput!): ID
		removeUserFromEvent(input: EventCheckInInput!): ID
		registerNFCUIDWithUser(input: NFCRegisterInput!): ID
		signedUploadUrl(input: ID!): String!
		confirmMySpot: User!
	}
`;
