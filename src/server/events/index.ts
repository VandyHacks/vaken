import ical from 'node-ical';
import { AuthenticationError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import { EventUpdateInput, EventDbObject } from '../generated/graphql';
import { Models } from '../models';
import { EventUpdate } from '../../client/routes/events/ManageEventTypes';

const { CALENDARID } = process.env;
const url = `https://www.google.com/calendar/ical/${CALENDARID}/public/basic.ics`;

const filterByCalType = (objNames: string[], cal: Record<string, any>, type: string) => {
	return objNames.filter(obj => cal[obj].type === type);
};

const filterCalByObjectNames = (objNames: string[], cal: Record<string, any>) => {
	return objNames.map(key => cal[key]);
};

export async function pullCalendar(): Promise<EventUpdate[] | null> {
	const cal = await ical.fromURL(url);
	if (!cal) return null;
	const calObjects = Object.keys(cal);
	const events = filterByCalType(calObjects, cal, 'VEVENT');
	const eventsListRaw = filterCalByObjectNames(events, cal);
	if (eventsListRaw.length === 0) return null;
	const eventsTransformed = eventsListRaw.map(event => {
		const parsedStart = new Date(event.start);
		const parsedEnd = new Date(event.end);
		const parsedType = /\[(.*?)\]/.exec(event.summary);
		return {
			name: event.summary,
			startTimestamp: event.start,
			duration: Math.floor((parsedEnd.getTime() - parsedStart.getTime()) / (1000 * 60)),
			description: event.description,
			location: event.location,
			eventType: parsedType != null ? parsedType[1] : '',
		} as EventUpdate;
	});
	return eventsTransformed;
}

export async function checkEventExists(
	eventName: string,
	models: Models
): Promise<EventDbObject | null> {
	const event = await models.Events.findOne({
		name: eventName,
	});
	return event;
}

export async function addOrUpdateEvent(
	eventInput: EventUpdateInput,
	models: Models
): Promise<string | null> {
	// Create a temp db object using input to keep param header clean (Can't pass in EventDbObject)
	const eventDiffObj = {
		_id: new ObjectID(),
		attendees: [],
		checkins: [],
		warnRepeatedCheckins: false,
		name: eventInput.name,
		startTimestamp: new Date(eventInput.startTimestamp),
		duration: eventInput.duration,
		description: eventInput.description,
		location: eventInput.location,
		eventType: eventInput.eventType,
	} as EventDbObject;
	await models.Events.findOneAndUpdate(
		{ name: eventDiffObj.name },
		{
			$set: {
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
		{ upsert: true }
	);
	const eventCreated = await checkEventExists(eventInput.name, models);
	if (!eventCreated) throw new AuthenticationError('Event not updated or created');
	return eventCreated.name;
}
