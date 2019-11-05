import ical, { CalendarResponse, CalendarComponent, VEvent } from 'node-ical';
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import { EventUpdateInput, EventDbObject, CompanyDbObject } from '../generated/graphql';
import { Models } from '../models';
import { EventUpdate } from '../../client/routes/events/ManageEventTypes';

const EVENTTYPE = 'VEVENT';

const filterByCalType = (
	objNames: (keyof CalendarResponse)[],
	cal: CalendarResponse,
	type: string
): string[] => {
	return objNames.filter(obj => cal[obj].type === type).map(key => `${key}`);
};

const filterCalByObjectNames = (
	objNames: (keyof CalendarResponse)[],
	cal: CalendarResponse
): CalendarComponent[] => {
	return objNames.map(key => cal[key]);
};

// Helper func to simplify VEvent type because it was overly obtuse and dramatically hindered mocks for testing
const extractVEventIntoRecord = (event: VEvent): Record<string, string> => {
	return {
		summary: event.summary,
		start: new Date(event.start as Date).toUTCString(),
		end: new Date(event.end as Date).toUTCString(),
		location: event.location,
		description: event.description,
		uid: event.uid,
	};
};

export const transformCalEventToDBUpdate = (event: Record<string, string>): EventUpdate => {
	if (!event.start || !event.end)
		throw new AuthenticationError('Calendar event did not contain start or end timestamp');
	const parsedStart = new Date(event.start);
	const parsedEnd = new Date(event.end);
	const parsedType = /\[(.*?)\]/.exec(event.description); // Looks for a **single** [Event Type] tag in name
	return {
		name: event.summary,
		startTimestamp: event.start,
		duration: Math.floor((parsedEnd.getTime() - parsedStart.getTime()) / (1000 * 60)),
		description: event.description.replace(/\s*\[(.*?)\]\s*/, ''), // Removes the [Event Type] tag in name
		location: event.location,
		eventType: parsedType != null ? parsedType[1] : '',
		gcalID: event.uid,
	} as EventUpdate;
};

export async function pullCalendar(calendarID: string | undefined): Promise<EventUpdate[] | null> {
	if (calendarID) {
		const url = `https://www.google.com/calendar/ical/${calendarID}/public/basic.ics`;
		const cal = await ical.fromURL(url).catch(err => {
			throw new Error(`Could not fetch calendar at URL: ${url}; Error: ${err.message}`);
		});
		const calKeys = Object.keys(cal);
		const eventsKeys = filterByCalType(calKeys, cal, EVENTTYPE);
		const eventsObjects = filterCalByObjectNames(eventsKeys, cal) as VEvent[];
		if (eventsObjects.length === 0) return null;
		const eventsTransformed = eventsObjects.map((event: VEvent) =>
			transformCalEventToDBUpdate(extractVEventIntoRecord(event))
		);
		return eventsTransformed;
	}
	throw new UserInputError('Calendar ID undefined or null');
}

/**
 * @param eventInput Object using EventUpdateInput Input type to define what needs to be updated
 * @returns Event
 */
export async function addOrUpdateEvent(
	eventInput: EventUpdateInput,
	models: Models
): Promise<EventDbObject> {
	if (!eventInput.id && !eventInput.gcalID)
		throw new Error('Event update request must contain either its database ID or GCal uid');
	// Create a temp db object using input to keep param header clean (Can't pass in EventDbObject)
	const eventDiffObj = {
		_id: eventInput.id ? new ObjectID(eventInput.id) : new ObjectID(), // Use ID to search if requested update contains it, else assume no ID
		attendees: [],
		checkins: [],
		warnRepeatedCheckins: false,
		name: eventInput.name,
		startTimestamp: new Date(eventInput.startTimestamp),
		duration: eventInput.duration,
		description: eventInput.description,
		location: eventInput.location,
		eventType: eventInput.eventType,
		gcalID: eventInput.gcalID,
	} as EventDbObject;
	const { value, lastErrorObject, ok } = await models.Events.findOneAndUpdate(
		eventDiffObj.gcalID ? { gcalID: eventDiffObj.gcalID } : { _id: eventDiffObj._id },
		{
			$set: {
				name: eventDiffObj.name,
				startTimestamp: eventDiffObj.startTimestamp,
				duration: eventDiffObj.duration,
				description: eventDiffObj.description,
				location: eventDiffObj.location,
				eventType: eventDiffObj.eventType,
			},
			$setOnInsert: {
				attendees: [],
				checkins: [],
				warnRepeatedCheckins: true,
			},
		},
		{
			returnOriginal: false,
			upsert: true,
		}
	);

	if (!value || !ok)
		throw new Error(
			`Event ${eventInput.name} <${value}> unsuccessful: ${JSON.stringify(lastErrorObject)}`
		);
	return value;
}

/**
 * Remove all events from DB that are not in param list eventIDS
 * @param eventIDs list of object event IDs
 */
export async function removeAbsentEvents(eventIDs: ObjectID[], models: Models): Promise<number> {
	const ret = await models.Events.deleteMany({
		$and: [
			{
				_id: {
					$nin: eventIDs,
				},
			},
			{ eventType: { $ne: 'Booth' } },
		],
	});
	if (ret.deletedCount === undefined)
		throw new Error(`Could not remove multiple events: ${eventIDs}}`);
	return ret.deletedCount;
}

export async function getCompanyEvents(
	companyID: ObjectID,
	models: Models
): Promise<EventDbObject[]> {
	const company = await models.Companies.findOne({ _id: companyID });
	if (company) {
		const events = await models.Events.find({ owner: company }).toArray();
		return events;
	}
	throw new Error('Company not found in database');
}

export async function checkIdentityForEvent(
	eventID: string,
	companyID: ObjectID,
	models: Models
): Promise<boolean> {
	const companyEvents = await getCompanyEvents(companyID, models);
	const eventIDs = companyEvents.map(event => event._id);
	return eventIDs.some(id => id.equals(eventID));
}

async function unassignEventFromCompany(
	eventID: string,
	models: Models
): Promise<CompanyDbObject | null> {
	const owningCompany = await models.Companies.findOne({ eventsOwned: eventID });
	if (owningCompany) {
		const companyRet = await models.Companies.updateOne(
			{ _id: owningCompany._id },
			{
				$pull: {
					eventsOwned: eventID,
				},
			}
		);
		if (!companyRet.result.ok)
			throw new Error(`Could not remove event from company ${owningCompany._id.toHexString()}`);
		return owningCompany;
	}
	return null;
}

export async function assignEventToCompany(
	eventID: string,
	companyID: string,
	models: Models
): Promise<EventDbObject> {
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
		if (!eventRet.ok || !eventRet.value)
			throw new Error(`Assigning event ${eventID} to company ${companyID} unsuccessful`);
		await unassignEventFromCompany(eventID, models);
		const companyRet = await models.Companies.findOneAndUpdate(
			{ _id: companyObjID },
			{
				$addToSet: {
					eventsOwned: eventObjID.toHexString(),
				},
			},
			{ returnOriginal: false }
		);
		if (!companyRet.ok || !companyRet.value)
			throw new Error(`Assigning company ${companyID} with event ${eventID} unsuccessful`);
		return eventRet.value;
	}
	throw new Error('Company or event not found in database');
}
