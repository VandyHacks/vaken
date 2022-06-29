import { gql } from '@apollo/client';

export default gql`
	type Shift @entity(embedded: true) {
		begin: Float! @column(overrideType: "Date")
		end: Float! @column(overrideType: "Date")
	}

	type Mentor implements OldUser @entity {
		shifts: [Shift!]! @embedded
		skills: [String!]! @column
	}

	type Mutation {
		# application
		updateMyApplication(input: UpdateMyAppInput!): User!
		hackerStatus(input: HackerStatusInput!): Hacker!
		hackerStatuses(input: HackerStatusesInput!): [Hacker!]!
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

	input EventCheckInInputByNfc {
		nfcId: String!
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

	input SponsorInput {
		email: String!
		name: String!
		companyId: ID!
	}

	input SponsorStatusInput {
		email: String!
		status: SponsorStatus!
	}

	input TierInput {
		name: String!
		permissions: [String!]
	}

	input CompanyInput {
		name: String!
		tierId: ID!
	}

	input EventUpdateInput {
		name: String!
		startTimestamp: String!
		duration: Int!
		description: String!
		location: String!
		eventType: String!
		gcalID: String
		id: String
		eventScore: Int
	}

	input AssignSponsorEventInput {
		companyId: String!
		eventId: String!
	}

	input IdListInput {
		ids: [ID!]!
	}
`;
