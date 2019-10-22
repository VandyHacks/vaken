import { ObjectId, MongoError } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { AuthenticationError } from 'apollo-server-core';
import { query } from '../resolvers/helpers';
import { HackerDbObject, EventDbObject, EventUpdateInput } from '../generated/graphql';
import DB, { Models } from '../models';
import {
	pullCalendar,
	checkEventExistsByName,
	transformCalEventToDBUpdate,
	addOrUpdateEvent,
} from '.';
import { EventUpdate } from '../../client/routes/events/ManageEventTypes';

let mongoServer: MongoMemoryServer;
let dbClient: DB;
let models: Models;

const testHackerId = new ObjectId();
const testHacker = ({
	_id: testHackerId,
	email: 'foo@bar.com',
	eventsAttended: [],
	secondaryIds: ['ACTIVE_NFC_ID_TEST', 'INACTIVE_NFC_ID_TEST'],
} as unknown) as HackerDbObject;

const testEventId = new ObjectId();
const testEvent = ({
	_id: testEventId,
	attendees: [],
	checkins: [],
	description: 'testEventdesc',
	duration: 240,
	eventType: 'testType',
	location: 'location',
	name: 'testEventPreexisting',
	startTimestamp: new Date('2019-09-06T03:41:33.714+00:00'),
	warnRepeatedCheckins: true,
} as unknown) as EventDbObject;

const badEventObj: Record<string, any> = {
	summary: 'badEvent',
	start: null,
	end: null,
};

const testEventObj: Record<string, any> = {
	summary: 'testEvent [testType]',
	start: '2019-09-06T03:41:33.714+00:00',
	end: '2019-09-06T07:41:33.714+00:00',
	description: 'testEventdesc',
	location: 'location',
};

const testEventUpdate: EventUpdate = {
	name: 'testEvent',
	startTimestamp: '2019-09-06T03:41:33.714+00:00',
	duration: 240,
	description: 'testEventdesc',
	location: 'location',
	eventType: 'testType',
};

const testEventUpdate2: EventUpdate = {
	name: 'testEvent',
	startTimestamp: '2019-09-08T03:41:33.714+00:00',
	duration: 60,
	description: 'testEventdesc2',
	location: 'location2',
	eventType: 'testType2',
};

const vhCalendarID = 'vanderbilt.edu_8p58kn7032badn5et22pq1iqjs@group.calendar.google.com';

beforeAll(async () => {
	try {
		mongoServer = new MongoMemoryServer();
		const mongoUri = await mongoServer.getConnectionString();
		dbClient = new DB(mongoUri);
		models = await dbClient.collections;
		await models.Hackers.insertOne(testHacker);
		await models.Events.insertOne(testEvent);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
});

afterAll(async () => {
	try {
		if (dbClient) await dbClient.disconnect();
		if (mongoServer) await mongoServer.stop();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
});

describe('Test events updating', () => {
	describe('checkEventExistsByName', () => {
		it('returns null if an event not found by name', async () => {
			await expect(checkEventExistsByName('Foo', models)).resolves.toEqual(null);
		});
		it('returns event name if found', async () => {
			await expect(checkEventExistsByName('testEventPreexisting', models)).resolves.toEqual(
				testEvent
			);
		});
	});
	describe('pullCalendar', () => {
		it('returns null on bad calendar ID', async () => {
			await expect(pullCalendar('foo')).resolves.toEqual(null);
		});
		it('returns items on real calendar (must contain at least 1 event)', async () => {
			const res = await pullCalendar(vhCalendarID);
			if (res) {
				await expect(res.length).toBeGreaterThanOrEqual(1);
				await expect(res[0].name).toBeDefined();
			} else throw new MongoError('Could not get calendar');
		});
	});
	describe('transformCalEventToDBUpdate', () => {
		it('throws on event with no start or end', () => {
			try {
				transformCalEventToDBUpdate(badEventObj);
			} catch (e) {
				expect(e.message).toEqual('Calendar event did not contain start or end timestamp');
			}
		});
		it('returns correct eventupdate', async () => {
			expect(transformCalEventToDBUpdate(testEventObj)).toEqual(testEventUpdate);
		});
	});
	describe('addOrUpdateEvent', () => {
		it('successfully adds new event', async () => {
			const ret = await addOrUpdateEvent(testEventUpdate as EventUpdateInput, models);
			expect(ret).toEqual(testEventUpdate.name);
			const newEvent = await models.Events.findOne({ name: testEventUpdate.name });
			if (newEvent) expect(newEvent.name).toEqual(testEventUpdate.name);
			else throw new MongoError('Could not find new event');
		});

		describe('successfully updates event helper', () => {
			const testCheckIn = {
				_id: ObjectId.createFromTime(Date.now()),
				timestamp: new Date(),
				user: testHackerId.toHexString(),
			};
			const attendeesMock = [testHackerId.toHexString()];
			const checkinsMock = [testCheckIn];
			beforeAll(async () => {
				try {
					const ret = await models.Events.findOneAndUpdate(
						{ name: testEventUpdate.name },
						{
							$set: {
								attendees: attendeesMock,
								checkins: checkinsMock,
							},
						}
					);
					if (!ret.value) throw new MongoError("Can't set attendees array");
				} catch (err) {
					// eslint-disable-next-line no-console
					console.error(err);
				}
			});
			afterAll(async () => {
				await models.Events.deleteOne({
					name: testEventUpdate.name,
				});
			});

			it('successful event update', async () => {
				const addedEvent = await models.Events.findOne({ name: testEventUpdate.name }); // get id
				const addedEventID = addedEvent ? addedEvent._id : null;
				const ret = await addOrUpdateEvent(testEventUpdate2 as EventUpdateInput, models);
				await expect(ret).toEqual(testEventUpdate2.name);
				const eventAfter = await models.Events.findOne({ name: testEventUpdate2.name });
				if (eventAfter != null && addedEventID) {
					await expect(eventAfter._id).toEqual(addedEventID);
					await expect(eventAfter.attendees).toEqual(attendeesMock);
					await expect(eventAfter.checkins).toEqual(checkinsMock);
					await expect(eventAfter.description).toEqual(testEventUpdate2.description);
					await expect(eventAfter.duration).toEqual(testEventUpdate2.duration);
					await expect(eventAfter.eventType).toEqual(testEventUpdate2.eventType);
					await expect(eventAfter.startTimestamp).toEqual(
						new Date(testEventUpdate2.startTimestamp)
					);
					await expect(eventAfter.location).toEqual(testEventUpdate2.location);
				} else throw new MongoError('Could not find new event');
			});
		});
	});
});
