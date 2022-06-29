import { gql } from 'apollo-server';

export const typeDefs = gql`
	"""
	Roles the user has. Each role confers permissions for a fine-grained action.

	Must be kept in sync with definitions in other subgraphs.
	"""
	enum Role {
		HACKER
		SPONSOR
		ORGANIZER
		VOLUNTEER
		SUPER_ADMIN
	}

	"""
	Logical representation of a user. This type is extended with domain-specific
	fields in various subgraphs.
	"""
	type User
		@key(fields: "id")
		@entity(
			additionalFields: [{ path: "providers", type: "Array<{ provider: string, token: string }>" }]
		) {
		"User's unique identifier"
		id: ID! @id @column

		"Email of the user"
		email: String @column

		"Time the user was created, in milliseconds since the unix epoch. Float is required for millisecond precision."
		createdAt: Float @column(overrideType: "Date")

		"""
		Roles the user has been explicitly conferred. Note that these roles may not be indicative of a user's capabilities, as
		the groups subgraph may contribute additional or mask explicitly conferred roles. See \`roles\` in the groups subgraph.
		"""
		selfRoles: [Role!] @column

		"Whether the user has unsubscribed from emails from VandyHacks. If so, this user should not be sent further emails"
		emailUnsubscribed: Boolean @column
	}

	"""
	Possible filters for users
	"""
	enum UserFilter {
		"Returns all users. Does not filter results"
		ALL
		"Users with the \`APPLY\` role"
		HACKERS
		"Hackers who have filled out their application"
		APPLICATION_SUBMITTED
		# "Hackers who have been admitted into the hackathon"
		# ADMITTED
		# "Hackers who have opted into volunteering"
		# VOLUNTEERS
	}

	"""
	Enum to disambiguate which identifier is supplied.
	"""
	enum IdType {
		"Primary ID, such as the User's \`id\` field"
		PRIMARY
		"Secondary ID, such as an NFC tag id contained in the User's \`secondaryIds\` field"
		SECONDARY
		"The user's email"
		EMAIL
	}

	extend type Query {
		"Fetches information about the currently logged in user. May be used when a user is not logged in."
		loggedInUser: User

		"Returns an individual user based by ID"
		user(
			"Id of the user, either primary ID, secondary ID, or an email"
			id: ID!
			"Whether the id is the user's primary ID, secondary ID, or an email"
			idType: IdType = PRIMARY
		): User

		"Returns list of all users."
		users(
			"How many hackers to retrieve. High default to return all hackers if possible"
			first: Int = 1000
			"Begin paginating results after the supplied ID"
			after: ID
			"Filters users to return. Defaults to user that have applied to the hackathon"
			filter: UserFilter = HACKERS
		): [User!]!
	}

	extend type Mutation {
		"""
		Associates the log in with a database entity. If a user by the corresponding email address
		does not exist, a new user with default permissions is created.

		If the token fails validation, this is a no-op and a null user is returned.
		"""
		logInUser(email: String!, provider: String!, token: String!): User
	}
`;
