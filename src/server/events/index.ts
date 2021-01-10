import { fromURL, CalendarResponse, CalendarComponent, VEvent } from 'node-ical';
import { UserInputError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import { EventUpdateInput, EventDbObject, CompanyDbObject } from '../generated/graphql';
import { Models } from '../models';
import { EventUpdate } from '../../client/routes/events/ManageEventTypes';
import logger from '../logger';

const EVENTTYPE = 'VEVENT';
const POINTS_REGEX = /Points:?[\s\n]+?([0-9]*)/;

// Simplified VEvent type because it was overly obtuse and dramatically hindered mocks for testing
export type SimplifiedVEvent = Pick<
	VEvent,
	'summary' | 'start' | 'end' | 'location' | 'description' | 'uid'
>;

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

export const transformCalEventToDBUpdate = (event: SimplifiedVEvent): EventUpdate => {
	if (!event.start && !event.end) {
		throw new TypeError('Calendar event did not contain start or end timestamp');
	}
	// Either start or end may be undefined, but not both due to guard above.
	// Fall back to whatever is defined if one is missing.
	// This may happen if the event has exactly 0 duration in Google Calendar.
	const parsedStart = event.start ?? (event.end as Date);
	const parsedEnd = event.end ?? (event.start as Date);
	let parsedScore = 0;
	if (POINTS_REGEX.test(event.description)) {
		const result = POINTS_REGEX.exec(event.description);
		try {
			parsedScore = parseInt((result ?? [])[1], 10);
		} catch (e) {
			logger.log(
				`No point value found for event ${event} or could not parse ${(result ?? [])[1]} as int`
			);
		}
	}
	const parsedType = /\[(.*?)\]/.exec(event.description); // Looks for a **single** [Event Type] tag in name
	return {
		name: event.summary,
		startTimestamp: parsedStart.toUTCString(),
		duration: Math.floor((parsedEnd.getTime() - parsedStart.getTime()) / (1000 * 60)),
		description: event.description.replace(/\s*\[(.*?)\]\s*/, ''), // Removes the [Event Type] tag in name
		location: event.location,
		eventType: parsedType != null ? parsedType[1] : '',
		eventScore: parsedScore,
		gcalID: event.uid,
	} as EventUpdate;
};

export async function pullCalendar(calendarID: string | undefined): Promise<EventUpdate[] | null> {
	if (calendarID) {
		const url = `https://www.google.com/calendar/ical/${calendarID}/public/basic.ics`;
		const cal = await fromURL(url).catch(err => {
			throw new Error(`Could not fetch calendar at URL: ${url}; Error: ${err.message}`);
		});
		const calKeys = Object.keys(cal);
		const eventsKeys = filterByCalType(calKeys, cal, EVENTTYPE);
		const eventsObjects = filterCalByObjectNames(eventsKeys, cal) as VEvent[];
		if (eventsObjects.length === 0) return null;
		const eventsTransformed = eventsObjects.map((event: VEvent) =>
			transformCalEventToDBUpdate(event)
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
		eventScore: eventInput.eventScore,
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
				eventScore: eventDiffObj.eventScore,
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
