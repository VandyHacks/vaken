import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import { DEADLINE_TIMESTAMP } from '../../../common/constants';
import { HackerDbObject, ApplicationStatus, MutationResolvers } from '../../generated/graphql';
import { sendStatusEmail } from '../../mail/aws';

// TODO: Cannot import frontend files so this is ugly workaround. Fix this.
const requiredFields = [
	'firstName',
	'lastName',
	// 'shirtSize',
	'gender',
	'phoneNumber',
	'dateOfBirth',
	'school',
	'major',
	'gradYear',
	'race',
	// 'favArtPiece',
	// 'essay1',
	// 'volunteer',
	'resume',
	'location',
	'codeOfConduct',
	'infoSharingConsent',
];

export const updateMyApplication: MutationResolvers['updateMyApplication'] = async (
	root,
	{ input },
	{ user, models }
) => {
	// Enables a user to update their application
	if (!user) throw new AuthenticationError(`cannot update application: user not logged in`);

	if (Date.now() > DEADLINE_TIMESTAMP)
		throw new Error(`Deadline to submit application has passed.`);

	// TODO(leonm1): Figure out why the _id field isn't actually an ObjectID
	const id = ObjectID.createFromHexString((user._id as unknown) as string);
	// update app answers if they exist
	const { result } = await models.ApplicationFields.bulkWrite(
		// TODO: These are not typechecked currently :/
		input.fields.map(({ question, answer }) => ({
			updateOne: {
				filter: { question, userId: id },
				update: { $set: { answer, question, userId: id } },
				upsert: true,
			},
		}))
	);

	if (!result.ok) {
		throw new UserInputError(
			`error inputting user application input for user "${id}" ${JSON.stringify(result)}`
		);
	}

	const hacker = await models.Hackers.findOne({ _id: id });
	if (!hacker) throw new AuthenticationError(`hacker not found: ${id.toHexString()}`);

	/**
	 * Finds the first element that is required (not optional) but does not have any input.
	 * If this element exists, the application is not finished.
	 */
	const appFinished = !requiredFields.some(
		field => !input.fields.find(el => el.question === field && el.answer)
	);

	// Update the fields of the hacker object with application data.
	// TODO: Improve the quality of this resolver by removing this hack.
	const changedFields = [
		'firstName',
		'preferredName',
		'lastName',
		'shirtSize',
		'gender',
		'dietaryRestrictions',
		'phoneNumber',
		'race',
		'school',
		'gradYear',
		'volunteer',
		'location',
	].reduce((acc: Partial<HackerDbObject>, reqField) => {
		// TODO: Add input validation for these fields.
		const missingField = input.fields.find(field => field.question === reqField);
		return missingField ? { ...acc, [reqField]: missingField.answer } : acc;
	}, {});

	// Update application status to reflect new input.
	let appStatus: ApplicationStatus = hacker.status as ApplicationStatus;
	let sendEmail = false;

	if (
		appFinished &&
		[ApplicationStatus.Started, ApplicationStatus.Created].includes(
			hacker.status as ApplicationStatus
		)
	) {
		if (input.submit) {
			appStatus = ApplicationStatus.Submitted;
			sendEmail = true;
		}
	} else if ([ApplicationStatus.Created].includes(hacker.status as ApplicationStatus)) {
		appStatus = ApplicationStatus.Started;
	}

	const { value, ok, lastErrorObject } = await models.Hackers.findOneAndUpdate(
		{ _id: id },
		{ $set: { status: appStatus, ...changedFields } },
		{ returnOriginal: false }
	);

	if (!ok || !value) {
		throw new UserInputError(
			`error inputting user status "SUBMITTED" for user "${id}" ${JSON.stringify(lastErrorObject)}`
		);
	}
	if (sendEmail) sendStatusEmail(value, ApplicationStatus.Submitted);
	return value;
};
