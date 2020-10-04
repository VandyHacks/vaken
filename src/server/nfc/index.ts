import { ObjectID } from 'mongodb';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { EventDbObject, HackerDbObject, UserDbInterface } from '../generated/graphql';
import { Models } from '../models';
import logger from '../logger';

// TODO: (kenli/timliang) Expand functions for Organizers, Mentors collections
export async function checkIfNFCUIDExisted(
	nfcID: string,
	models: Models
): Promise<HackerDbObject | null> {
	const hacker = await models.Hackers.findOne({
		secondaryIds: nfcID,
	});
	return hacker;
}

export const userIsAttendingEvent = (hacker: HackerDbObject, event: EventDbObject): boolean =>
	hacker !== null &&
	hacker.eventsAttended &&
	hacker.eventsAttended.includes(event._id.toHexString());

export const shouldWarnRepeatedCheckIn = (hacker: HackerDbObject, event: EventDbObject): boolean =>
	event.warnRepeatedCheckins && userIsAttendingEvent(hacker, event);

export async function getUser(nfcID: string, models: Models): Promise<HackerDbObject | null> {
	const user = await models.Hackers.findOne({
		'secondaryIds.0': nfcID,
	});
	return user;
}

export async function isNFCUIDAvailable(nfcID: string, models: Models): Promise<boolean> {
	return (await getUser(nfcID, models)) == null;
}

export async function registerNFCUIDWithUser(
	nfcID: string,
	userID: string,
	models: Models
): Promise<UserDbInterface> {
	if (!(await isNFCUIDAvailable(nfcID, models)))
		throw new AuthenticationError(`NFC ID ${nfcID} not available`);

	const ret = await models.Hackers.findOneAndUpdate(
		{ _id: new ObjectID(userID) },
		{
			$push: {
				secondaryIds: {
					$each: [nfcID],
					$position: 0,
				},
			},
		},
		{ returnOriginal: false }
	);

	logger.info(`registered user ${userID} with NFC id ${nfcID}`);

	if (ret.value) {
		if (ret.value.secondaryIds.length > 1) {
			throw new Error(`Associated new NFC ID with user overriding the old NFC ID`);
		}
		return ret.value;
	}

	throw new Error(`Unable to associate NFC ID with user: ${userID}. User not found.`);
}

export async function removeUserFromEvent(
	userID: string,
	eventID: string,
	models: Models
): Promise<UserDbInterface> {
	const [{ result: eventResult }, hackerResult] = await Promise.all([
		models.Events.updateOne(
			{ _id: new ObjectID(eventID) },
			{
				$pull: {
					attendees: userID,
				},
			},
			{}
		),
		models.Hackers.findOneAndUpdate(
			{ _id: new ObjectID(userID) },
			{
				$pull: {
					eventsAttended: eventID,
				},
			}
		),
	]);
	if (!hackerResult.ok || !hackerResult.value) {
		logger.error(`Couldn't update user ${userID}":`, hackerResult);
		throw new Error(`Couldn't update user ${userID}`);
	}
	const user = hackerResult.value;
	if (!user.eventsAttended.includes(eventID))
		throw new Error(`${user.firstName} ${user.lastName} has not attended this event`);
	if (eventResult.ok && hackerResult.ok) {
		logger.info(
			`removed user ${userID} (${user?.firstName} ${user?.lastName}) from event ${eventID}`
		);
		// Simulate the behavior of returnOriginal.
		user.eventsAttended.splice(user.eventsAttended.indexOf(eventID), 1);
		return user;
	}

	throw new Error(`failed to remove ${user.firstName} ${user.lastName} from event ${eventID}`);
}

export async function checkInUserToEvent(
	userID: string,
	eventID: string,
	models: Models
): Promise<UserDbInterface> {
	const userObjectID = new ObjectID(userID);
	const eventObjectID = new ObjectID(eventID);
	const retUserPromise = models.Hackers.findOneAndUpdate(
		{ _id: userObjectID },
		{
			$addToSet: {
				eventsAttended: eventID,
			},
		},
		{ returnOriginal: true }
	);
	const eventCheckInObjID = ObjectID.createFromTime(Date.now());
	const eventCheckInObj = {
		_id: eventCheckInObjID,
		timestamp: new Date(),
		user: userID,
	};
	const retEventPromise = models.Events.findOneAndUpdate(
		{ _id: eventObjectID },
		{
			$addToSet: { attendees: userID },
			$push: { checkins: eventCheckInObj },
		},
		{ returnOriginal: false }
	);

	const retUser = await retUserPromise;
	if (!retUser.value || !retUser.ok) {
		models.Events.findOneAndUpdate(
			{ _id: eventObjectID },
			{
				$pull: { checkins: { _id: eventCheckInObjID }, attendees: userID },
			}
		);
		throw new UserInputError(`user ${userID} not found`);
	}

	const retEvent = await retEventPromise;
	if (retUser.value?.eventsAttended.includes(eventID) && retEvent.value?.warnRepeatedCheckins) {
		throw new Error(
			`${retUser.value?.firstName} ${retUser.value?.lastName} (${userID}) is already checked into event`
		);
	}
	if (retEvent.ok && retUser.ok && retUser.value) {
		logger.info(`checked in user ${userID} to event ${eventID}`);

		// Simulate the behavior of `{ returnOriginal: true }`
		retUser.value.eventsAttended.push(eventID);
		return retUser.value;
	}

	throw new Error(`failed checking user <${userID}> into event <${eventID}>`);
}

export async function getEventsAttended(userID: string, models: Models): Promise<string[]> {
	const user = await models.Hackers.findOne({ _id: new ObjectID(userID) });
	return user != null && user.eventsAttended != null ? user.eventsAttended : [];
}

export async function getAttendees(eventID: string, models: Models): Promise<string[]> {
	const event = await models.Events.findOne({ _id: new ObjectID(eventID) });
	return event != null ? event.attendees : [];
}
