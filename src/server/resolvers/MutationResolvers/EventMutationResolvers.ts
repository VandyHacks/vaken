import { UserInputError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import { Models } from '../../models';
import Context from '../../context';
import {
	UserType,
	MutationResolvers,
	EventCheckInInputByNfc,
	HackerDbObject,
	UserDbInterface,
} from '../../generated/graphql';
import { checkIsAuthorized } from '../helpers';
import { addOrUpdateEvent, assignEventToCompany, removeAbsentEvents } from '../../events';
import {
	checkInUserToEvent,
	removeUserFromEvent,
	registerNFCUIDWithUser,
	getUser,
} from '../../nfc';

// reuse for removing and checking in for an event
const nfcVerification = async (
	input: EventCheckInInputByNfc,
	models: Models,
	user?: UserDbInterface
): Promise<HackerDbObject> => {
	checkIsAuthorized([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], user);
	const inputUser = await getUser(input.nfcId, models);
	if (!inputUser) throw new UserInputError(`user with nfc id <${input.nfcId}> not found`);
	return inputUser;
};

export const EventMutation: MutationResolvers<Context> = {
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
	checkInUserToEventByNfc: async (root, { input }, { models, user }) => {
		const inputUser = await nfcVerification(input, models, user);
		return checkInUserToEvent(inputUser._id.toString(), input.event, models);
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
		const inputUser = await nfcVerification(input, models, user);
		return removeUserFromEvent(inputUser._id.toString(), input.event, models);
	},
};
