import { ObjectID } from 'mongodb';
import { HackerDbObject, EventDbObject } from '../generated/graphql';
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
	const userObjectID = new ObjectID(userID);
	const user = await models.Hackers.findOne({ _id: userObjectID });
	if (user) {
		const event = await models.Events.findOne({ attendees: userObjectID.toHexString() });
		if (event) {
			const ret = await models.Events.updateOne(
				{ _id: new ObjectID(eventID) },
				{
					$pull: {
						attendees: userObjectID.toHexString(),
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
	const userObjectID = new ObjectID(userID);
	const eventObjectID = new ObjectID(eventID);
	const user = await models.Hackers.findOne({ _id: userObjectID });
	if (user) {
		const eventCheckInObj = {
			_id: ObjectID.createFromTime(Date.now()),
			timestamp: new Date(),
			user: userID,
		};
		const retEvent = await models.Events.findOneAndUpdate(
			{ _id: eventObjectID },
			{ $addToSet: { attendees: userObjectID.toHexString() } }
		);
		await models.Events.findOneAndUpdate(
			{ _id: eventObjectID },
			{ $push: { checkins: eventCheckInObj } }
		);
		const retUsr = await models.Hackers.findOneAndUpdate(
			{ _id: userObjectID },
			{
				$addToSet: {
					eventsAttended: eventObjectID.toHexString(),
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
	const userObjectID = new ObjectID(userID);
	const user = await models.Hackers.findOne({ _id: userObjectID });
	if (user) {
		const event = await models.Events.findOne({
			_id: new ObjectID(eventID),
			attendees: userObjectID.toHexString(),
		});
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
	return user != null && user.eventsAttended != null ? user.eventsAttended : [];
}

export async function getAttendees(eventID: string, models: Models): Promise<string[]> {
	const event = await models.Events.findOne({ _id: new ObjectID(eventID) });
	return event != null ? event.attendees : [];
}

export async function getCompanyEvents(
	companyID: string,
	models: Models
): Promise<EventDbObject[]> {
	const company = await models.Companies.findOne({ _id: new ObjectID(companyID) });
	if (company) {
		const events = await models.Events.find({ owner: company }).toArray();
		return events;
	}
	throw new Error('Company not found in database');
}

export async function checkIdentityForEvent(
	eventID: string,
	companyID: string,
	models: Models
): Promise<boolean> {
	const companyEvents = await getCompanyEvents(companyID, models);
	const eventIDs = companyEvents.map(event => event._id);
	return eventIDs.some(id => id.equals(eventID));
}

export async function assignEventToCompany(
	eventID: string,
	companyID: string,
	models: Models
): Promise<EventDbObject | undefined> {
	const eventObjID = new ObjectID(eventID);
	const companyObjID = new ObjectID(companyID);
	const company = await models.Companies.findOne({ _id: companyObjID });
	const event = await models.Events.findOne({ _id: eventObjID });
	if (event && company) {
		const eventRet = await models.Events.findOneAndUpdate(
			{ _id: eventObjID },
			{
				$set: {
					owner: company,
				},
			},
			{ returnOriginal: false }
		);
		if (!eventRet.ok)
			throw new Error(`Assigning event ${eventID} to company ${companyID} unsuccessful`);
		const companyRet = await models.Companies.findOneAndUpdate(
			{ _id: companyObjID },
			{
				$addToSet: {
					eventsOwned: eventObjID.toHexString(),
				},
			},
			{ returnOriginal: false }
		);
		if (!companyRet.ok)
			throw new Error(`Assigning company ${companyID} with event ${eventID} unsuccessful`);
		return eventRet.value;
	}
	throw new Error('Company or event not found in database');
}
