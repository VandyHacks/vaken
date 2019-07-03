import { gql } from 'apollo-boost';

export default gql`
	interface User {
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
		race: [Race!]! 
		userType: UserType! 
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
		UXS
		US
		UM
		UL
		UXL
		UXXL
		WS
		WM
		WL
		WXL
		WXXL
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

	type ApplicationQuestion {
		prompt: String! 
		instruction: String 
		note: String 
	}

	type ApplicationField {
		id: ID! 
		createdAt: Int!
		question: ApplicationQuestion! 
		answer: String 
	}

	type Login
		(
			additionalFields: [{ path: "email", type: "string" }, { path: "type", type: "UserType" }]
		) {
		createdAt: Int!
		provider: LoginProvider! 
		token: ID! 
		userType: UserType! 
	}

	type Hacker implements User {
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
		race: [Race!]!
		userType: UserType!
		modifiedAt: Int! 
		status: ApplicationStatus! 
		school: String 
		gradYear: Int 
		majors: [String!]! 
		adult: Boolean 
		volunteer: Boolean 
		github: String 
		team: Team 
	}

	type Shift {
		begin: Int!
		end: Int!
	}

	type Mentor implements User {
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
		race: [Race!]!
		userType: UserType!
		shifts: [Shift!]! 
		skills: [String!]! 
	}

	type Team {
		id: ID!  
		createdAt: Int!
		name: String 
		memberIds: [ID!]! 
		size: Int!
	}

	type Organizer implements User  {
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
		race: [Race!]!
		userType: UserType!
		permissions: [String]! 
	}

	type Query {
		me: User!
		hacker(id: ID!): Hacker!
		hackers(sortDirection: SortDirection): [Hacker!]!
		organizer(id: ID!): Organizer!
		organizers(sortDirection: SortDirection): [Organizer!]!
		mentor(id: ID!): Mentor!
		mentors(sortDirection: SortDirection): [Mentor!]!
		team(id: ID!): Team!
		teams(sortDirection: SortDirection): [Team!]!
	}
`;
