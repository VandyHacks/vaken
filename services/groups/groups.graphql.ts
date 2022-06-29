import { gql } from 'apollo-server';

export const typeDefs = gql`
	"""
	Arbitrary grouping of users, designed to allow flexible representations of sponsors, organizers, and teams.
	"""
	type Group @key(fields: "id") @entity {
		"ID of the group"
		id: ID! @id @column

		"Creation time, in milliseconds since the Unix epoch. Float is required for millisecond precision"
		createdAt: Float @column(overrideType: "Date")

		"Name of the group, suitable for public display"
		name: String @column

		"List of users in the group"
		members: [User!] @column(overrideType: "Array<ObjectId>")

		"Roles that group members are granted"
		roles: [Role!] @column

		"""
		Roles that group members are not permitted to have.

		For example, this field may be used to remove the \`APPLY\` role from sponsors represented as groups.
		"""
		antiRoles: [Role!] @column
	}

	extend type User @key(fields: "id") {
		id: ID! @external

		selfRoles: [Role!] @external

		"Group the user is a part of. Allows a user to own events and delegate their group's permissions to other users."
		groups: [Group!]

		"Computes the effective roles granted to a user, accounting for group roles and anti-roles"
		roles: [Role!] @requires(fields: "groups { roles antiRoles } selfRoles")
	}

	extend type Query {
		"Returns an individual group by ID"
		group(groupId: ID!): Group

		"Returns list of all groups"
		groups(
			"How many groups to retrieve. High default to return all groups if possible"
			first: Int = 1000
			"Begin paginating results after the supplied ID"
			after: ID
		): [Group!]!
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

	extend type Mutation {
		"""
		Creates and returns a group with the specified name
		"""
		createGroup("Human-readable name of the group" name: String!): Group!

		"""
		Updates the specified group's roles to match those specified
		"""
		setGroupRoles(
			"ID of the group to update"
			groupId: String!
			"Roles users of this group are granted"
			roles: [Role!]!
			"Roles users of this group are revoked"
			antiRoles: [Role!]!
		): Group

		"""
		Adds a user to the specified group, either by primary user ID or email
		"""
		addUserToGroup(
			"Group to add the user to"
			groupId: ID!
			"Primary ID of the user to add to the group"
			userId: ID!
			"Whether the userId provided is their primary ID, secondary ID, or email.  Defaults to primary"
			userIdType: IdType = PRIMARY
		): User

		"""
		Removes a user from the specified group
		"""
		removeUserFromGroup(
			"Group to remove the user from"
			groupId: ID!
			"Primary ID of the user to remove from the group"
			userId: ID!
			"Whether the userId provided is their primary ID, secondary ID, or email. Defaults to primary"
			userIdType: IdType = PRIMARY
		): User
	}

	#####
	###  Definitions from other subgraphs
	#
	"""
	Roles able to be conferred to a user. Primary definition in Users subgraph. Must be kept in sync.
	"""
	enum Role {
		HACKER
		SPONSOR
		ORGANIZER
		VOLUNTEER
		SUPER_ADMIN
	}
`;
