import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ObjectID, FindAndModifyWriteOpResultObject } from 'mongodb';
import {
	HackerDbObject,
	OrganizerDbObject,
	EventDbObject,
	EventCheckInDbObject,
	ShirtSize,
	UserDbInterface,
	UserInput,
	UserType,
} from '../generated/graphql';
import Context from '../context';
import {
	fetchUser,
	query,
	queryById,
	toEnum,
	updateUser,
	checkIsAuthorized,
} from '../resolvers/helpers';
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
): Promise<string | null> {
	if (await isNFCUIDAvailable(nfcID, models)) {
		const ret = await models.Hackers.findOneAndUpdate(
			{ _id: new ObjectID(userID) },
			{
				$push: {
					secondaryIds: {
						$each: [nfcID],
						$position: 0,
					},
				},
			}
		);
		if (ret.value !== undefined) return userID;
	}
	return null;
}

export async function removeUserFromEvent(
	userID: string,
	eventID: string,
	models: Models
): Promise<string | null> {
	const user = await models.Hackers.findOne({ _id: new ObjectID(userID) });
	if (user) {
		const nfcUID = user.secondaryIds[0];
		const event = await models.Events.findOne({ attendees: nfcUID });
		if (event) {
			const ret = await models.Events.updateOne(
				{ _id: new ObjectID(eventID) },
				{
					$pull: {
						attendees: nfcUID,
					},
				}
			);
			if (ret.result.ok) return userID;
		}
	}
	return null;
}

export async function checkInUserToEvent(
	userID: string,
	eventID: string,
	models: Models
): Promise<string | null> {
	const user = await models.Hackers.findOne({ _id: new ObjectID(userID) });
	if (user) {
		const eventCheckInObj = {
			id: ObjectID.createFromTime(Date.now()),
			timestamp: Date.now(),
			user: userID,
		};
		const retEvent = await models.Events.findOneAndUpdate(
			{ _id: new ObjectID(eventID) },
			{ $addToSet: { attendees: userID } }
		);
		await models.Events.findOneAndUpdate(
			{ _id: new ObjectID(eventID) },
			{ $push: { checkins: eventCheckInObj } }
		);
		const retUsr = await models.Hackers.findOneAndUpdate(
			{ _id: new ObjectID(userID) },
			{
				$addToSet: {
					eventsAttended: eventID,
				},
			}
		);
		if (retEvent.ok && retUsr.ok) return userID;
	}
	return null;
}

export async function userIsAttendingEvent(
	userID: string,
	eventID: string,
	models: Models
): Promise<boolean> {
	const user = await models.Hackers.findOne({ _id: new ObjectID(userID) });
	if (user) {
		const nfcUID = user.secondaryIds[0];
		const event = await models.Events.findOne({ _id: new ObjectID(eventID), attendees: nfcUID });
		if (event) return true;
	}
	return false;
}

export async function shouldWarnRepeatedCheckIn(
	userID: string,
	eventID: string,
	models: Models
): Promise<boolean> {
	const event = await models.Events.findOne({ _id: new ObjectID(eventID) });
	return (
		userIsAttendingEvent(userID, eventID, models) && event != null && event.warnRepeatedCheckins
	);
}

export async function getEventsAttended(userID: string, models: Models): Promise<string[]> {
	const user = await models.Hackers.findOne({ _id: new ObjectID(userID) });
	return user != null ? user.eventsAttended : [];
}

export async function getAttendees(eventID: string, models: Models): Promise<string[]> {
	const event = await models.Events.findOne({ _id: new ObjectID(eventID) });
	return event != null ? event.attendees : [];
}
