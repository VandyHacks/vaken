import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ObjectID, FindAndModifyWriteOpResultObject } from 'mongodb';
import {
	HackerDbObject,
	OrganizerDbObject,
	EventDbObject,
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

export async function checkIfNFCIDExisted(
	nfcID: string,
	models: Models
): Promise<HackerDbObject | null> {
	const hacker = await models.Hackers.findOne({
		secondaryIds: nfcID,
	});
	return hacker;
}

export async function getUserIDfromActiveNFCID(
	nfcID: string,
	models: Models
): Promise<UserDbInterface | null> {
	const user = models.Hackers.findOne({
		$match: nfcID,
		secondaryIds: { $slice: -1 },
	});
	return user;
}

export async function checkInUserToEvent(nfcID: string, event: string, models: Models) {
	const hackerObj = getUserIDfromActiveNFCID(nfcID, models);
	const eventObj = models.Events.findOne({ event });
	const eventReturn = await new Promise(() =>
		models.Events.findOneAndUpdate(
			{ id: event },
			{ $addToSet: { attendees: { id: hackerObj, timestamp: Date.now() } } }
		)
	).then(() =>
		models.Events.findOneAndUpdate(
			{ id: event },
			{ $push: { checkins: { id: hackerObj, timestamp: Date.now() } } }
		)
	);
	return eventReturn;
}
