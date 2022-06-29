import { gql } from 'apollo-server';

export const typeDefs = gql`
	extend type Application @key(fields: "id") {
		"Filename of the user's resume, likely as a "
		resumeFilename: String @column

		"Signed read URL for the user's resume"
		resumeUrl: String
	}

	"""
	Filter criteria for creating a resume dump. Uses regex matching of field values to limit the
	number of returned resumes. If a field is omitted from this type, it is not considered during
	filtering of users.
	"""
	input UserFilterCriteria {
		"Regex to match against the users' provided school"
		school: String

		"Regex to match against the users' provided grad year"
		gradYear: String

		"Regex to match against the users' provided major(s)"
		major: String

		"Regex to match against the users' provided race(s)"
		race: String

		"Regex to match against the users' provided gender"
		gender: String

		"Regex to match against the users' application status"
		applicationStatus: String
	}

	extend type Mutation {
		"""
		Retrieves a URL where a file may be uploaded. Individual users are only permitted
		to upload one file, so as a side effect, requesting a new file upload URL will delete
		any file owned by the user in storage. The corresponding file will be named after the
		user'd primary ID, followed by the file extension provided.
		"""
		fileUploadUrl(
			"Filename Extension (for example, '.docx') of the file in the storage bucket"
			fileExtension: String!
			"Content-Type header of the file to write to the storage bucket"
			contentType: String!
		): String

		"""
		Retrieves a signed read url for a zip file of resumes matching all of the provided filter criteria.

		This is implemented as a mutation, as it is expensive to call.
		"""
		resumeDumpUrl(filterCriteria: UserFilterCriteria): String
	}
`;
