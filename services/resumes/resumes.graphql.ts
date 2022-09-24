import { gql } from 'apollo-server';

export const typeDefs = gql`
	extend type Application @key(fields: "userId") {
		"ID of the user this application belongs to. Used primarily to link this GraphQL entity with other services"
		userId: ID! @column

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

	"""
	Represents an HTTP header key/value pair.
	"""
	type Header {
		"Key for the HTTP header"
		key: String

		"Value for the HTTP header"
		value: String
	}

	"""
	Response to requesting a file upload URL. The supplied headers MUST be
	included in the PUT request to upload the file or the upload will be
	rejected.
	"""
	type FileUploadResponse {
		"URL to PUT the file"
		url: String

		"Headers the client must supply in the PUT request"
		headers: [Header]
	}

	extend type Mutation {
		"""
		Retrieves a URL where a file may be uploaded. Individual users are only permitted
		to upload one file, so as a side effect, requesting a new file upload URL will delete
		any file owned by the user in storage. The corresponding filename may be a shortened
		form of the supplied filename. The filename and Content-Type must match the
		"""
		fileUploadUrl(
			"\`userId\` of the user who owns the file"
			userId: String!
			"Filename Extension (for example, '.docx') of the file in the storage bucket"
			filename: String!
			"Content-Type header of the file to write to the storage bucket"
			contentType: String!
		): FileUploadResponse

		"""
		Retrieves a signed read url for a zip file of resumes matching all of the provided filter criteria.

		This is implemented as a mutation, as it is expensive to call.
		"""
		resumeDumpUrl(filterCriteria: UserFilterCriteria): String
	}
`;
