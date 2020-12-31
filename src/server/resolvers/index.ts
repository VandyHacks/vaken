import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import {
	UserType,
	ApplicationStatus,
	HackerDbObject,
	SponsorStatus,
	SponsorDbObject,
	TierDbObject,
	CompanyDbObject,
} from '../generated/graphql';
import Context from '../context';
import { updateUser, checkIsAuthorized } from './helpers';
import { checkInUserToEvent, removeUserFromEvent, registerNFCUIDWithUser, getUser } from '../nfc';
// import { checkInUserToEvent, removeUserFromEvent, registerNFCUIDWithUser, getUser } from '../nfc';
import { addOrUpdateEvent, assignEventToCompany, removeAbsentEvents } from '../events';
import { getSignedUploadUrl } from '../storage/gcp';
import { sendStatusEmail } from '../mail/aws';
import logger from '../logger';
import { Hacker } from './HackerResolver';
import { ApplicationField } from './ApplicationFieldResolver';
import { Event } from './EventResolver';
import { EventCheckIn } from './EventCheckInResolver';
import { Company } from './CompanyResolver';
import { CustomResolvers } from './types';
import { Volunteer } from './VolunteerResolver';
import { Login } from './LoginResolver';
import { Mentor } from './MentorResolver';
import { Organizer } from './OrganizerResolver';
import { Query } from './QueryResolvers';
import { Sponsor } from './SponsorResolver';
import { Tier } from './TierResolver';
import { Team } from './TeamResolver';

// added here b/c webpack JSON compilation with 'use-strict' is broken (7/10/19 at 23:59)
const DEADLINE_TS = 1601679600000;

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
	'codeOfConduct',
	'infoSharingConsent',
];

export const resolvers: CustomResolvers<Context> = {
	/**
	 * These resolvers are for querying fields
	 */
	ApplicationField,
	Event,
	EventCheckIn,
	Company,
	Tier,
	Hacker,
	Volunteer,
	Login,
	Mentor,
	/**
	 * These mutations modify data
	 * Each may contain authentication checks as well
	 */
	Mutation: {
		assignEventToCompany: async (root, { input }, { models, user }) => {
			checkIsAuthorized(UserType.Organizer, user);
			return assignEventToCompany(input.eventId, input.companyId, models);
		},
		addOrUpdateEvent: async (root, { input }, { models, user }) => {
			checkIsAuthorized(UserType.Organizer, user);
			return addOrUpdateEvent(input, models);
		},
		checkInUserToEvent: async (root, { input }, { models, user }) => {
			checkIsAuthorized([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], user);
			return checkInUserToEvent(input.user, input.event, models);
		},
		checkInUserToEventAndUpdateEventScore: async (root, { input }, { models, user }) => {
			const userObject = checkIsAuthorized([UserType.Hacker, UserType.Volunteer], user);
			await checkInUserToEvent(input.user, input.event, models);
			const { ok, value, lastErrorObject: err } = await models.Hackers.findOneAndUpdate(
				{ _id: new ObjectID(userObject._id) },
				{ $inc: { eventScore: input.eventScore } },
				{ returnOriginal: false }
			);
			if (!ok || !value)
				throw new UserInputError(`user ${userObject._id} (${value}) error: ${JSON.stringify(err)}`);
			if (user) {
				// eslint-disable-next-line no-param-reassign
				user.eventScore = value.eventScore;
				// eslint-disable-next-line no-param-reassign
				user.eventsAttended = value.eventsAttended;
			}

			return value;
		},
		createSponsor: async (
			root,
			{ input: { email, name, companyId } },
			{ models, user }: Context
		): Promise<SponsorDbObject> => {
			checkIsAuthorized(UserType.Organizer, user);
			const company = await models.Companies.findOne({ _id: new ObjectID(companyId) });
			if (!company) throw new UserInputError(`Company with '${companyId}' doesn't exist.`);
			const sponsor = await models.Sponsors.findOne({ email });
			if (sponsor) throw new UserInputError(`sponsor with '${email}' is already added.`);

			const newSponsor: SponsorDbObject = {
				_id: new ObjectID(),
				company,
				createdAt: new Date(),
				email,
				firstName: name,
				lastName: '',
				logins: [],
				phoneNumber: '',
				dietaryRestrictions: '',
				emailUnsubscribed: false,
				eventsAttended: [],
				preferredName: '',
				secondaryIds: [],
				status: SponsorStatus.Added,
				userType: UserType.Sponsor,
			};
			logger.info(`creating new sponsor ${JSON.stringify(newSponsor)}`);
			await models.Sponsors.insertOne(newSponsor);
			return newSponsor;
		},
		confirmMySpot: async (root, _, { models, user }) => {
			const { _id, status } = checkIsAuthorized(UserType.Hacker, user) as HackerDbObject;
			const { ok, value, lastErrorObject: err } = await models.Hackers.findOneAndUpdate(
				{ _id: new ObjectID(_id), status: ApplicationStatus.Accepted },
				{ $set: { status: ApplicationStatus.Confirmed } },
				{ returnOriginal: false }
			);
			if (!ok || !value)
				throw new UserInputError(
					`user ${_id} (${value}) error: ${JSON.stringify(err)}` +
						'(Likely the user already declined/confirmed if no value returned)'
				);

			// `confirmMySpot` is an identity function if user is already confirmed and is a
			// no-op if user wasn't accepted. If status changed, user is newly confirmed.
			if (value.status !== status) sendStatusEmail(value, ApplicationStatus.Confirmed);

			return value;
		},
		declineMySpot: async (root, _, { models, user }) => {
			const { _id } = checkIsAuthorized(UserType.Hacker, user) as HackerDbObject;
			const { ok, value, lastErrorObject: err } = await models.Hackers.findOneAndUpdate(
				{ _id: new ObjectID(_id), status: ApplicationStatus.Accepted },
				{ $set: { status: ApplicationStatus.Declined } },
				{ returnOriginal: false }
			);
			if (!ok || !value)
				throw new UserInputError(
					`user ${_id} (${value}) error: ${JSON.stringify(err)}` +
						'(Likely the user already declined/confirmed if no value returned)'
				);
			// no email sent if declined
			return value;
		},
		createTier: async (
			root,
			{ input: { name, permissions } },
			{ models, user }: Context
		): Promise<TierDbObject> => {
			checkIsAuthorized(UserType.Organizer, user);
			const tier = await models.Tiers.findOne({ name });
			// currently does not support updating
			if (tier) throw new UserInputError(`Tier ${name} already exists, no action performed.`);

			const newTier: TierDbObject = {
				_id: new ObjectID(),
				name,
				permissions: permissions || [],
			};
			logger.info(`creating tier ${JSON.stringify(newTier)}`);
			await models.Tiers.insertOne(newTier);
			return newTier;
		},
		createCompany: async (
			root,
			{ input: { name, tierId } },
			{ models, user }: Context
		): Promise<CompanyDbObject> => {
			checkIsAuthorized(UserType.Organizer, user);
			const tier = await models.Tiers.findOne({ _id: new ObjectID(tierId) });
			if (!tier) throw new UserInputError(`Tier with id ${tierId}' doesn't exist.`);
			// currently does not support updating
			const comp = await models.Companies.findOne({ name });
			if (comp) throw new UserInputError(`Company ${name} already exists, no action performed.`);

			const newCompany: CompanyDbObject = {
				_id: new ObjectID(),
				name,
				tier,
				eventsOwned: [],
			};
			logger.info(`creating company ${JSON.stringify(newCompany)}`);
			await models.Companies.insertOne(newCompany);
			return newCompany;
		},
		checkInUserToEventByNfc: async (root, { input }, { models, user }) => {
			checkIsAuthorized([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], user);
			const inputUser = await getUser(input.nfcId, models);
			if (!inputUser) throw new UserInputError(`user with nfc id <${input.nfcId}> not found`);
			return checkInUserToEvent(inputUser._id.toString(), input.event, models);
		},
		hackerStatus: async (_, { input: { id, status } }, { user, models }) => {
			checkIsAuthorized(UserType.Organizer, user);
			const { ok, value, lastErrorObject: err } = await models.Hackers.findOneAndUpdate(
				{ _id: ObjectID.createFromHexString(id) },
				{ $set: { status } },
				{ returnOriginal: false }
			);

			if (!ok || !value)
				throw new UserInputError(`user ${id} (${value}) error: ${JSON.stringify(err)}`);

			if (status === ApplicationStatus.Accepted) sendStatusEmail(value, ApplicationStatus.Accepted);
			else if (status === ApplicationStatus.Rejected)
				sendStatusEmail(value, ApplicationStatus.Rejected);

			return value;
		},
		hackerStatuses: async (_, { input: { ids, status } }, { user, models }) => {
			checkIsAuthorized(UserType.Organizer, user);
			const objectIds = ids.map(id => ObjectID.createFromHexString(id));
			const { result } = await models.Hackers.updateMany(
				{ _id: { $in: objectIds } },
				{ $set: { status } }
			);

			if (!result.ok)
				throw new UserInputError(`Error updating hacker statuses for: ${JSON.stringify(ids)}}`);

			const updatedHackers = await models.Hackers.find({ _id: { $in: objectIds } }).toArray();

			// AWS Docs say to do each mail request synchronously instead of in bulk.
			if (status === ApplicationStatus.Accepted)
				updatedHackers.forEach(hacker => sendStatusEmail(hacker, ApplicationStatus.Accepted));

			return updatedHackers;
		},
		joinTeam: async (root, { input: { name } }, { models, user }) => {
			const hacker = checkIsAuthorized(UserType.Hacker, user);
			const team = await models.Teams.findOne({ name });
			if (!team) {
				await models.Teams.insertOne({
					_id: new ObjectID(),
					createdAt: new Date(),
					memberIds: [],
					name,
				});
			}
			const { ok, lastErrorObject: err } = await models.Teams.findOneAndUpdate(
				{ name },
				{ $push: { memberIds: hacker.email } }
			);
			if (!ok) throw new UserInputError(`error adding "${hacker.email}" to team "${name}": ${err}`);
			const result = await models.UserTeamIndicies.findOneAndUpdate(
				{ email: hacker.email },
				{ $set: { email: hacker.email, team: name } },
				{ upsert: true }
			);
			if (!result.ok) {
				throw new UserInputError(
					`error adding "${hacker.email}" to team index "${name}": ${result.lastErrorObject}`
				);
			}

			const ret = await models.Hackers.findOne({ email: hacker.email });
			if (!ret) throw new AuthenticationError(`hacker not found: ${hacker.email}`);
			return ret;
		},
		leaveTeam: async (root, args, { models, user }) => {
			const hacker = checkIsAuthorized(UserType.Hacker, user);
			const { value, ok, lastErrorObject: err } = await models.UserTeamIndicies.findOneAndDelete({
				email: hacker.email,
			});
			if (!value || !ok)
				throw new UserInputError(`error removing user team index: ${JSON.stringify(err)}`);

			const { value: team, ok: okTeam, lastErrorObject: e } = await models.Teams.findOneAndUpdate(
				{ name: value.team },
				{ $pull: { memberIds: hacker.email } },
				{ returnOriginal: false }
			);
			if (!team || !okTeam)
				throw new UserInputError(`error removing user from team: ${JSON.stringify(e)}`);
			if (!team.memberIds.length) models.Teams.findOneAndDelete({ name: value.team });

			const ret = await models.Hackers.findOne({ email: hacker.email });
			if (!ret) throw new AuthenticationError(`hacker not found: ${hacker.email}`);
			return ret;
		},
		registerNFCUIDWithUser: async (root, { input }, { models, user }) => {
			checkIsAuthorized(UserType.Organizer, user);
			return registerNFCUIDWithUser(input.nfcid, input.user, models);
		},
		removeAbsentEvents: async (root, { input }, { models, user }) => {
			checkIsAuthorized(UserType.Organizer, user);
			const objectIds = input.ids.map(id => ObjectID.createFromHexString(id));
			return removeAbsentEvents(objectIds, models);
		},
		removeUserFromEvent: async (root, { input }, { models, user }) => {
			checkIsAuthorized([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], user);
			return removeUserFromEvent(input.user, input.event, models);
		},
		removeUserFromEventByNfc: async (root, { input }, { models, user }) => {
			checkIsAuthorized([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], user);
			const inputUser = await getUser(input.nfcId, models);
			if (!inputUser) throw new UserInputError(`user with nfc Id ${input.nfcId} not found`);
			return removeUserFromEvent(inputUser._id.toString(), input.event, models);
		},
		signedUploadUrl: async (_, _2, { user }) => {
			if (!user) throw new AuthenticationError(`cannot get signed upload url: user not logged in`);
			return getSignedUploadUrl(`${user._id}`);
		},
		updateMyApplication: async (root, { input }, { user, models }) => {
			// Enables a user to update their application
			if (!user) throw new AuthenticationError(`cannot update application: user not logged in`);

			if (Date.now() > DEADLINE_TS) throw new Error(`Deadline to submit application has passed.`);

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
				// 'dietaryRestrictions',
				'phoneNumber',
				'race',
				'school',
				'gradYear',
				'volunteer',
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
					`error inputting user status "SUBMITTED" for user "${id}" ${JSON.stringify(
						lastErrorObject
					)}`
				);
			}
			if (sendEmail) sendStatusEmail(value, ApplicationStatus.Submitted);
			return value;
		},
		sponsorStatus: async (_, { input: { email, status } }, { models }: Context) => {
			const { ok, value, lastErrorObject: err } = await models.Sponsors.findOneAndUpdate(
				{ email },
				{ $set: { status } },
				{ returnOriginal: false }
			);
			if (!ok || err || !value)
				throw new UserInputError(`user ${email} (${value}) error: ${JSON.stringify(err)}`);
			return value;
		},
		updateMyProfile: async (root, { input }, { models, user }) => {
			// Enables a user to update their own profile
			if (!user) throw new AuthenticationError(`cannot update profile: user not logged in`);
			const result = await updateUser(user, input, models);
			if (!result)
				throw new UserInputError(`unable to update profile: "${JSON.stringify(user)}" not found `);
			return result;
		},
		updateProfile: async () => {
			throw new UserInputError('Not implemented :(');
		},
	},
	Organizer,
	Query,
	Shift: {
		begin: async shift => (await shift).begin.getTime(),
		end: async shift => (await shift).end.getTime(),
	},
	Sponsor,
	Team,
	User: {
		__resolveType: user => {
			switch (user.userType) {
				case UserType.Hacker:
					return 'Hacker';
				case UserType.Organizer:
					return 'Organizer';
				case UserType.Sponsor:
					return 'Sponsor';
				case UserType.Volunteer:
					return 'Volunteer';
				default:
					throw new AuthenticationError(`cannot decode UserType "${user.userType}`);
			}
		},
	},
};

export default resolvers;
