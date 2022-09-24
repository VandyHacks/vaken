import { gql } from 'apollo-server';

export const typeDefs = gql`
	"""
	Race, as a combination of the US Census bureau's definitions for race and ethnicity:
	https://www.census.gov/topics/population/race/about.html
	"""
	enum Race {
		WHITE
		BLACK_OR_AFRICAN_AMERICAN
		AMERICAN_INDIAN_OR_ALASKA_NATIVE
		ASIAN
		NATIVE_HAWAIIAN_PACIFIC_ISLANDER
		HISPANIC_OR_LATINO
	}

	"""
	Container for combination of [0,6] \`Race\` enum values as well as a free-text "other" field.
	"""
	type RacesWithOther @entity(embedded: true) {
		"User-provided multiselect selections for their race. If no selections are made, will be empty array."
		race: [Race!]! @column
		"User-provided 'other' text for their race."
		other: String @column
	}

	"""
	Enumeration of common dietary restrictions, chosen based on the list of restrictions
	hackathon organizers can reasonably fulfil.
	"""
	enum DietaryRestriction {
		VEGETARIAN
		VEGAN
		NUT_ALLERGY
		LACTOSE_ALLERGY
		GLUTEN_FREE
		KOSHER
		HALAL
	}

	"""
	Container for combination of \`Race\` enum values as well as free-text "other" field.
	"""
	type DietaryRestrictionsWithOther @entity(embedded: true) {
		"User-provided multiselect selections for their dietary restrictions. If no selections are made, will be empty array."
		dietaryRestriction: [DietaryRestriction!]! @column
		"User-provided 'other' text for their dietary restrictions."
		other: String @column
	}

	"""
	Enumerations for common gender responses
	"""
	enum Gender {
		MALE
		FEMALE
		PREFER_NOT_TO_SAY
	}

	"""
	Container for common gender responses and a free-text "other" field.
	"""
	type GenderWithOther @entity(embedded: true) {
		"User-provided selection for their gender. May be null is no selection is made."
		gender: Gender @column
		"User-provided 'other' text for their gender."
		other: String @column
	}

	"""

	"""
	enum ShirtSize {
		NO_SHIRT
		XS
		S
		M
		L
		XL
		XXL
		WOMENS_XS
		WOMENS_S
		WOMENS_M
		WOMENS_L
		WOMENS_XL
		WOMENS_XXL
	}

	"""
	Status of the hacker's application, as defined by it's level of completion at time of saving their application or acceptance status.
	"""
	enum ApplicationStatus {
		"Hacker has been created, but their application is not yet started"
		CREATED
		"Hacker has started their application, but has not yet filled out all required fields"
		STARTED
		"Hacker has finished their application, but it has not yet been reviewed"
		SUBMITTED
		"Hacker has finished their application and been accepted to the hackathon"
		ACCEPTED
		"Hacker has been accepted to the hackathon and has confirmed they will attend"
		CONFIRMED
		"Hacker was accepted to the hackathon, but declined their offer to attend"
		DECLINED
		"Hacker hash finished their application, but was not accepted to the hackathon"
		REJECTED
		"Hacker has been confirmed as in-attendance at the hackathon"
		ATTENDED
	}

	"""
	Whether or not the hacker elected to volunteer to be available for helping during the hackathon.
	"""
	enum VolunteerOption {
		OPT_IN
		OPT_OUT
	}

	"""
	Whether or not the hacker is of legal age to attend the hackathon.
	"""
	enum AgeEligibility {
		"The hacker is too young to attend the hackathon. For VandyHacks, this indicates their are under 18 years old."
		INELIGIBLE
		"The hacker is old enough to attend the hackathon. For VandyHacks, this indicates the hacker is over 18."
		ELIGIBLE
	}

	"""
	Generic representation of fields and responses
	"""
	type ApplicationField @entity(embedded: true) {
		"Field name of the question"
		field: String @column
		"If the question is a text-response, the user's response, else a json-serialized representation of structured data"
		response: String @column
	}

	input ApplicationFieldInput {
		"Field name of the question"
		field: String
		"If the question is a text-response, the user's response, else a json-serialized representation of structured data"
		response: String
	}

	"""
	Represents information provided by a hacker attempting to apply to the hackathon.
	No fields in this type are guaranteed to be present under any circumstances.

	Not all fields in the form hackers fill out are present in this type, to allow
	computation of stats for common fields as well as allowing for easy
	extensibility.

	All explicit fields in this type must be manually extracted in the
	SubmitApplication resolver using the ApplicationField.field entry and set in the
	corresponding field of this type set, else it will not be populated. Application
	fields not explicitly present in this type may be accessed via the "application" array.
	"""
	type Application @entity @key(fields: "userId") {
		"ID of the user this application belongs to. Used primarily to link this GraphQL entity with other services"
		userId: ID! @column
		"When the hacker's application was last saved, in milliseconds since the unix epoch"
		modifiedAt: Float @column(overrideType: "Date")
		"Status of the user's application. Indicates if the user has been accepted."
		status: ApplicationStatus @column

		### Directory information used to fill out the HackerTable.

		"Legal first name of the hacker"
		firstName: String @column
		"Preferred first name of the hacker"
		preferredName: String @column
		"Legal last name of the hacker"
		lastName: String @column
		"School the hacker attends/attended"
		school: String @column
		"Year the hacker graduates/ed from their school"
		gradYear: String @column

		### Dashboard tally information useful for organizers

		"Shirt size specified for the hacker, for swag purchasing purposes"
		shirtSize: ShirtSize @column
		"Dietary restrictions of the hacker, for food ordering purposes"
		dietaryRestrictions: DietaryRestrictionsWithOther @embedded
		"Gender of the hacker, for demographic purposes"
		gender: GenderWithOther @embedded
		"Race of the hacker, for demographic purposes"
		race: RacesWithOther @embedded
		"Majors of the hacker, for demographic purposes"
		majors: [String!] @column
		"Whether the hacker is a legal adult, for legal compliance purposes"
		adult: AgeEligibility @column
		"Whether the hacker opted to volunteer to help out during the hackathon"
		volunteer: VolunteerOption @column

		"Array of all application fields, including those extracted into structured fields above"
		application: [ApplicationField!] @embedded
	}

	extend type User @key(fields: "id") {
		"User's unique identifier"
		id: ID! @id @column

		"Application fields from the hacker's application, if filled out."
		application: Application
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
		Primary mutation for saving a user's application.
		"""
		saveApplication(
			"Primary of user to update application"
			userId: ID!
			"""
			Application fields corresponding to the user's responses to a series of questions

			Fields not specified in the mutation will neither be updated nor cleared when saving. To clear
			a field in the backend, the field name should be supplied as an \`ApplicationField\` and the
			corresponding \`response\` field left blank
			"""
			applicationField: [ApplicationFieldInput!]!
			"""
			If true, may update the \`applicationStatus\` to 'Submitted' if the user's application answers
			all required questions
			"""
			updateStatus: Boolean = false
		): User

		"""
		Sets the \`applicationStatus\` field of the corresponding user(s) to the \`applicationStatus\` supplied as an argument.
		"""
		setUserApplicationStatus(
			"ApplicationStatus enum value to set"
			applicationStatus: ApplicationStatus!
			"Primary or secondary ID of user to update status"
			userId: [ID!]!
			"Whether the userId supplied is a primary ID or a secondary ID. Defaults to primary."
			userIdType: IdType = PRIMARY
		): [User!]
	}
`;
