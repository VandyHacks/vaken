import { ObjectId, MongoError } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
	HackerDbObject,
	EventDbObject,
	EventUpdateInput,
	CompanyDbObject,
	TierDbObject,
} from '../generated/graphql';
import DB, { Models } from '../models';
import {
	pullCalendar,
	transformCalEventToDBUpdate,
	addOrUpdateEvent,
	checkIdentityForEvent,
	assignEventToCompany,
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

const testCompanyId = new ObjectId();
const testCompany = ({
	_id: testCompanyId,
	name: 'test company',
	tier: { _id: new ObjectId(), name: 'tier', permissions: ['none'] } as TierDbObject,
	eventsOwned: [],
} as unknown) as CompanyDbObject;

const badEventObj: Record<string, string> = {
	summary: 'summary',
	start: '',
	end: '',
};

const testEventObj: Record<string, string> = {
	summary: 'testEvent [testType]',
	start: '2019-09-06T03:41:33.714+00:00',
	end: '2019-09-06T07:41:33.714+00:00',
	description: 'testEventdesc',
	location: 'location',
	uid: 'testGcalID',
};

const testEventUpdateGcal: EventUpdate = {
	name: 'testEvent',
	startTimestamp: '2019-09-06T03:41:33.714+00:00',
	duration: 240,
	description: 'testEventdesc',
	location: 'location',
	eventType: 'testType',
	gcalID: 'testGcalID',
};

const testEventUpdateGcal2: EventUpdate = {
	name: 'testEvent2',
	startTimestamp: '2019-09-08T03:41:33.714+00:00',
	duration: 60,
	description: 'testEventdesc2',
	location: 'location2',
	eventType: 'testType2',
	gcalID: 'testGcalID',
};

const eventID = new ObjectId();
const testEventUpdateByID: EventUpdate = {
	name: 'testEventbyID',
	startTimestamp: '2019-09-06T03:41:33.714+00:00',
	duration: 240,
	description: 'testEventdesc',
	location: 'location',
	eventType: 'testType',
	id: eventID.toHexString(),
};

const testEventUpdateByID2: EventUpdate = {
	name: 'testEvent2byID',
	startTimestamp: '2019-09-08T03:41:33.714+00:00',
	duration: 60,
	description: 'testEventdesc2',
	location: 'location2',
	eventType: 'testType2',
	id: eventID.toHexString(),
};

const badTestEventUpdate: EventUpdate = {
	name: 'badTestEventUpdate',
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
		await models.Companies.insertOne(testCompany);
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
	describe('pullCalendar', () => {
		it('throws on null calendar ID', async () => {
			try {
				await pullCalendar(undefined);
			} catch (e) {
				expect(e.message).toEqual('Calendar ID undefined or null');
			}
		});
		it('throws on bad calendar ID', async () => {
			try {
				await pullCalendar('foo');
			} catch (e) {
				expect(e.message).toContain('400 Bad Request');
			}
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
			expect(transformCalEventToDBUpdate(testEventObj)).toEqual(testEventUpdateGcal);
		});
	});
	describe('addOrUpdateEvent', () => {
		describe('test with no GCal or ID', () => {
			it('throws on bad event', async () => {
				try {
					await addOrUpdateEvent(badTestEventUpdate as EventUpdateInput, models);
				} catch (e) {
					expect(e.message).toEqual(
						'Event update request must contain either its database ID or GCal uid'
					);
					const test = await models.Events.findOne({ name: badTestEventUpdate.name });
					expect(test).toBeFalsy();
				}
			});
		});
		describe('test using GCal', () => {
			it('successfully adds new event using Gcal', async () => {
				const ret = await addOrUpdateEvent(testEventUpdateGcal as EventUpdateInput, models);
				await expect(ret.name).toEqual(testEventUpdateGcal.name);
				const newEvent = await models.Events.findOne({ gcalID: testEventUpdateGcal.gcalID });
				if (newEvent) expect(newEvent.name).toEqual(testEventUpdateGcal.name);
				else throw new MongoError('Could not find new event');
			});

			describe('successfully updates event using Gcal helper', () => {
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
							{ name: testEventUpdateGcal.name },
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
						gcalID: testEventUpdateGcal.gcalID,
					});
				});

				it('successful event update using Gcal', async () => {
					const addedEvent = await models.Events.findOne({ name: testEventUpdateGcal.name }); // get id
					const addedEventID = addedEvent ? addedEvent._id : null;
					await addOrUpdateEvent(testEventUpdateGcal2 as EventUpdateInput, models);
					const eventAfter = await models.Events.findOne({ gcalID: testEventUpdateGcal2.gcalID });
					if (eventAfter != null && addedEventID) {
						await expect(eventAfter.name).toEqual(testEventUpdateGcal2.name);
						await expect(eventAfter._id).toEqual(addedEventID);
						await expect(eventAfter.attendees).toEqual(attendeesMock);
						await expect(eventAfter.checkins).toEqual(checkinsMock);
						await expect(eventAfter.description).toEqual(testEventUpdateGcal2.description);
						await expect(eventAfter.duration).toEqual(testEventUpdateGcal2.duration);
						await expect(eventAfter.eventType).toEqual(testEventUpdateGcal2.eventType);
						await expect(eventAfter.startTimestamp).toEqual(
							new Date(testEventUpdateGcal2.startTimestamp)
						);
						await expect(eventAfter.location).toEqual(testEventUpdateGcal2.location);
					} else throw new MongoError('Could not find new event');
				});
			});
		});

		describe('test using ID', () => {
			it('successfully adds new event using ID', async () => {
				const ret = await addOrUpdateEvent(testEventUpdateByID as EventUpdateInput, models);
				await expect(ret.name).toEqual(testEventUpdateByID.name);
				const newEvent = await models.Events.findOne({ _id: new ObjectId(testEventUpdateByID.id) });
				if (newEvent) expect(newEvent.name).toEqual(testEventUpdateByID.name);
				else throw new MongoError('Could not find new event');
			});

			describe('successfully updates event using ID helper', () => {
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
							{ _id: new ObjectId(testEventUpdateByID.id) },
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
						_id: new ObjectId(testEventUpdateByID.id),
					});
				});

				it('successful event update using ID', async () => {
					const addedEvent = await models.Events.findOne({ name: testEventUpdateByID.name }); // get id
					const addedEventID = addedEvent ? addedEvent._id : null;
					await addOrUpdateEvent(testEventUpdateByID2 as EventUpdateInput, models);
					const eventAfter = await models.Events.findOne({
						_id: new ObjectId(testEventUpdateByID2.id),
					});
					if (eventAfter != null && addedEventID) {
						await expect(eventAfter.name).toEqual(testEventUpdateByID2.name);
						await expect(eventAfter._id).toEqual(addedEventID);
						await expect(eventAfter.attendees).toEqual(attendeesMock);
						await expect(eventAfter.checkins).toEqual(checkinsMock);
						await expect(eventAfter.description).toEqual(testEventUpdateByID2.description);
						await expect(eventAfter.duration).toEqual(testEventUpdateByID2.duration);
						await expect(eventAfter.eventType).toEqual(testEventUpdateByID2.eventType);
						await expect(eventAfter.startTimestamp).toEqual(
							new Date(testEventUpdateByID2.startTimestamp)
						);
						await expect(eventAfter.location).toEqual(testEventUpdateByID2.location);
					} else throw new MongoError('Could not find new event');
				});
			});
		});
	});
	describe('checkIdentityForEvent', () => {
		afterAll(async () => {
			try {
				const ret = await models.Events.findOneAndUpdate(
					{ _id: testEventId },
					{
						$set: {
							owner: null,
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't set attendees");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});
		describe('catch error', () => {
			beforeEach(async () => {
				try {
					models.Companies.deleteOne({ _id: testCompanyId });
				} catch (err) {
					// eslint-disable-next-line no-console
					console.error(err);
				}
			});
			afterAll(async () => {
				try {
					models.Companies.insertOne(testCompany);
				} catch (err) {
					// eslint-disable-next-line no-console
					console.error(err);
				}
			});
			it('Throws error on non-existent company', async () => {
				try {
					await checkIdentityForEvent(testEventId.toHexString(), testCompanyId, models);
				} catch (err) {
					expect(err.message).toEqual('Company not found in database');
				}
			});
		});

		it('Return false on non-associated event', async () => {
			await expect(
				checkIdentityForEvent(testEventId.toHexString(), testCompanyId, models)
			).resolves.toEqual(false);
		});
		describe('check for true helper', () => {
			beforeEach(async () => {
				try {
					const ret = await models.Events.findOneAndUpdate(
						{ _id: testEventId },
						{
							$set: {
								owner: testCompany,
							},
						}
					);
					if (!ret.value) throw new MongoError("Can't set attendees");
				} catch (err) {
					// eslint-disable-next-line no-console
					console.error(err);
				}
			});
			it('Returns true on associated event', async () => {
				await expect(
					checkIdentityForEvent(testEventId.toHexString(), testCompanyId, models)
				).resolves.toEqual(true);
			});
		});
	});
	describe('assignEventToCompany', () => {
		it('Sponsor-event association works in the best case', async () => {
			await assignEventToCompany(testEventId.toHexString(), testCompanyId.toHexString(), models);
			const companyAfter = await models.Companies.findOne({ _id: testCompanyId });
			const eventAfter = await models.Events.findOne({ _id: testEventId });
			if (companyAfter && eventAfter) {
				expect(companyAfter.eventsOwned).toContain(testEventId.toHexString());
				if (eventAfter.owner)
					expect(eventAfter.owner._id.toHexString()).toEqual(testCompanyId.toHexString());
				else throw new Error('Event not associated with owner');
			} else throw new Error('Updated company or event not found');
		});

		// TODO: Additional testing for error throwing
	});
});
