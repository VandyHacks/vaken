import { gql } from 'apollo-boost';

export default gql`
	interface User @abstractEntity(discriminatorField: "userType") {
		id: ID! @id @column
		createdAt: Int! @column(overrideType: "Date")
		secondaryIds: [ID!]! @column
		logins: [Login!]! @embedded
		email: String! @column
		firstName: String! @column
		preferredName: String! @column
		lastName: String! @column
		shirtSize: ShirtSize @column
		gender: String @column
		dietaryRestrictions: [DietaryRestriction!]! @column
		userType: UserType! @column
		phoneNumber: String @column
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
		EMAIL_VERIFIED
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

	type ApplicationQuestion @entity {
		prompt: String! @column
		instruction: String @column
		note: String @column
	}

	type ApplicationField @entity(embedded: true) {
		id: ID! @column
		createdAt: Int! @column(overrideType: "Date")
		question: ApplicationQuestion! @embedded
		answer: String @column
	}

	type Login @entity(additionalFields: [{ path: "email", type: "string" }]) {
		createdAt: Int! @column(overrideType: "Date")
		provider: LoginProvider! @column
		token: ID! @column
		userType: UserType! @column
	}

	type Hacker implements User @entity {
		id: ID!
		createdAt: Int!
		secondaryIds: [ID!]!
		logins: [Login!]!
		email: String!
		firstName: String!
		preferredName: String!
		lastName: String!
		shirtSize: ShirtSize
		gender: String
		dietaryRestrictions: [DietaryRestriction!]!
		userType: UserType!
		phoneNumber: String
		race: [Race!]! @column
		modifiedAt: Int! @column
		status: ApplicationStatus! @column
		school: String @column
		gradYear: Int @column
		majors: [String!]! @column
		adult: Boolean @column
		volunteer: Boolean @column
		github: String @column
		team: Team @embedded
	}

	type Shift @entity(embedded: true) {
		begin: Int! @column(overrideType: "Date")
		end: Int! @column(overrideType: "Date")
	}

	type Mentor implements User @entity {
		id: ID!
		createdAt: Int!
		secondaryIds: [ID!]!
		logins: [Login!]!
		email: String!
		firstName: String!
		preferredName: String!
		lastName: String!
		shirtSize: ShirtSize
		gender: String
		dietaryRestrictions: [DietaryRestriction!]!
		userType: UserType!
		phoneNumber: String
		shifts: [Shift!]! @embedded
		skills: [String!]! @column
	}

	type Team @entity(embedded: true) {
		id: ID! @id @column
		createdAt: Int! @column(overrideType: "Date")
		name: String @column
		memberIds: [ID!]! @column
		size: Int!
	}

	type Organizer implements User @entity {
		id: ID!
		createdAt: Int!
		secondaryIds: [ID!]!
		logins: [Login!]!
		email: String!
		firstName: String!
		preferredName: String!
		lastName: String!
		shirtSize: ShirtSize
		gender: String
		dietaryRestrictions: [DietaryRestriction!]!
		userType: UserType!
		phoneNumber: String
		permissions: [String]! @column
	}

	type Query {
		me: User # May be used when not logged in.
		hacker(id: ID!): Hacker!
		hackers(sortDirection: SortDirection): [Hacker!]!
		organizer(id: ID!): Organizer!
		organizers(sortDirection: SortDirection): [Organizer!]!
		mentor(id: ID!): Mentor!
		mentors(sortDirection: SortDirection): [Mentor!]!
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

	type Mutation {
		updateMyProfile(input: UserInput!): User!
		updateProfile(id: ID!, input: UserInput!): User!
		joinTeam(input: TeamInput!): Hacker!
		leaveTeam: Hacker!
		hackerStatus(input: HackerStatusInput!): Hacker!
		hackerStatuses(input: HackerStatusesInput!): [Hacker!]!
	}
`;
