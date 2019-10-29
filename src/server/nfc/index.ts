import { ObjectID } from 'mongodb';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { HackerDbObject, UserDbInterface } from '../generated/graphql';
import { Models } from '../models';

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

export async function userIsAttendingEvent(
	userID: string,
	eventID: string,
	models: Models
): Promise<boolean> {
	const userObjectID = new ObjectID(userID);
	const user = await models.Hackers.findOne({ _id: userObjectID, eventsAttended: eventID });
	return !!user;
}

export async function shouldWarnRepeatedCheckIn(
	userID: string,
	eventID: string,
	models: Models
): Promise<boolean> {
	const event = await models.Events.findOne({ _id: new ObjectID(eventID) });
	return (
		event != null && event.warnRepeatedCheckins && userIsAttendingEvent(userID, eventID, models)
	);
}

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
	const userObjectID = new ObjectID(userID);
	const user = await models.Hackers.findOne({ _id: userObjectID, eventsAttended: eventID });
	if (!user) throw new UserInputError(`User has not attended this event`);

	const ret = await Promise.all([
		models.Events.updateOne(
			{ _id: new ObjectID(eventID) },
			{
				$pull: {
					attendees: userObjectID.toHexString(),
				},
			},
			{}
		),
		models.Hackers.updateOne(
			{ _id: userObjectID },
			{
				$pull: {
					eventsAttended: eventID,
				},
			}
		),
	]);

	if (ret[0].result.ok && ret[1].result.ok) {
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
	const user = await models.Hackers.findOne({ _id: userObjectID });
	if (!user) if (!user) throw new UserInputError(`user ${userID} not found`);

	const eventCheckInObj = {
		_id: ObjectID.createFromTime(Date.now()),
		timestamp: new Date(),
		user: userID,
	};
	let retEvent = await models.Events.findOneAndUpdate(
		{ _id: eventObjectID },
		{
			$push: { checkins: eventCheckInObj },
		}
	);

	// TODO(mattleon): This requires hitting the DB like 5 times rip
	if (await shouldWarnRepeatedCheckIn(userID, eventID, models)) {
		throw new Error(`${user.firstName} ${user.lastName} is already checked into event`);
	}
	retEvent = await models.Events.findOneAndUpdate(
		{ _id: eventObjectID },
		{
			$addToSet: { attendees: userObjectID.toHexString() },
		},
		{ returnOriginal: false }
	);
	const retUsr = await models.Hackers.findOneAndUpdate(
		{ _id: userObjectID },
		{
			$addToSet: {
				eventsAttended: eventObjectID.toHexString(),
			},
		},
		{ returnOriginal: false }
	);
	if (retEvent.ok && retUsr.ok && retUsr.value) return retUsr.value;

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
