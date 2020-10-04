import { ObjectId, MongoError } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { query } from '../resolvers/helpers';
import { HackerDbObject, OrganizerDbObject, EventDbObject } from '../generated/graphql';
import DB, { Models } from '../models';
import {
	getUser,
	isNFCUIDAvailable,
	registerNFCUIDWithUser,
	removeUserFromEvent,
	checkInUserToEvent,
	userIsAttendingEvent,
	shouldWarnRepeatedCheckIn,
	getEventsAttended,
	getAttendees,
	checkIfNFCUIDExisted,
} from '.';

const testEvent2: EventDbObject = {
	_id: new ObjectId(),
	attendees: [],
	checkins: [],
	description: 'description',
	duration: 120,
	eventType: 'event type',
	location: 'location',
	name: 'event',
	eventScore: 100,
	startTimestamp: new Date(),
	warnRepeatedCheckins: true,
};

let mongoServer: MongoMemoryServer;
let dbClient: DB;
let models: Models;

const testHackerId = new ObjectId();
const testHacker = ({
	_id: testHackerId,
	firstName: 'abc',
	lastName: 'xyz',
	email: 'foo@bar.com',
	eventsAttended: [],
	secondaryIds: ['ACTIVE_NFC_ID_TEST', 'INACTIVE_NFC_ID_TEST'],
} as unknown) as HackerDbObject;
const testHackerId2 = new ObjectId();
const testHacker2 = ({
	_id: testHackerId2,
	email: 'foo@bar2.com',
	secondaryIds: ['ACTIVE_NFC_ID_TEST2', 'INACTIVE_NFC_ID_TEST2'],
	eventsAttended: [],
} as unknown) as HackerDbObject;
const testOrganizerId = new ObjectId();
const testOrganizer = ({
	_id: testOrganizerId,
	email: 'foo@bar.com',
} as unknown) as OrganizerDbObject;
const testEventId = new ObjectId();
const testEvent = ({
	_id: testEventId,
	name: 'test event',
	warnRepeatedCheckins: true,
} as unknown) as EventDbObject;

beforeAll(async () => {
	try {
		mongoServer = new MongoMemoryServer();
		const mongoUri = await mongoServer.getUri();
		dbClient = new DB(mongoUri);
		models = await dbClient.collections;
		await models.Hackers.insertOne(testHacker);
		await models.Hackers.insertOne(testHacker2);
		await models.Organizers.insertOne(testOrganizer);
		await models.Events.insertOne(testEvent);
		await models.Events.insertOne(testEvent2);
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

describe('Test event model', () => {
	describe('event query', () => {
		it('throws an error when the item is not found', async () => {
			await expect(query({ foo: 'bar' }, models.Events)).rejects.toThrow(
				'obj with filters: "{"foo":"bar"}" not found in collection "Events"'
			);
		});

		it('retrieves an object from the database', async () => {
			await expect(query({ location: 'location', name: 'event' }, models.Events)).resolves.toEqual(
				testEvent2
			);
		});
	});
	describe('checkIfNFCIDExisted', () => {
		it('check if an active NFC ID exists', async () => {
			await expect(checkIfNFCUIDExisted('ACTIVE_NFC_ID_TEST', models)).resolves.toEqual(testHacker);
		});
		it('check if an NFC ID doesnt exist', async () => {
			await expect(checkIfNFCUIDExisted('NEW_NFC_ID_TEST', models)).resolves.toEqual(null);
		});
		it('check if an inactive NFC ID existed', async () => {
			await expect(checkIfNFCUIDExisted('INACTIVE_NFC_ID_TEST', models)).resolves.toEqual(
				testHacker
			);
		});
	});
	describe('getUser', () => {
		it('check using active NFC ID', async () => {
			await expect(getUser('ACTIVE_NFC_ID_TEST', models)).resolves.toEqual(testHacker);
		});
		it('check using inactive NFC ID', async () => {
			await expect(getUser('INACTIVE_NFC_ID_TEST', models)).resolves.toEqual(null);
		});
	});
	describe('isNFCUIDAvailable', () => {
		it('check using active NFC ID', async () => {
			await expect(isNFCUIDAvailable('ACTIVE_NFC_ID_TEST', models)).resolves.toEqual(false);
		});
		it('check using inactive,nonexisting NFC ID', async () => {
			await expect(isNFCUIDAvailable('ACTIVE_NFC_ID_TEST3', models)).resolves.toEqual(true);
		});
		it('check using inactive,existing NFC ID', async () => {
			await expect(isNFCUIDAvailable('INACTIVE_NFC_ID_TEST', models)).resolves.toEqual(true);
		});
	});
	describe('registerNFCUIDWithUser', () => {
		beforeEach(async () => {
			try {
				const ret = await models.Hackers.findOneAndUpdate(
					{ _id: testHackerId },
					{
						$pop: {
							secondaryIds: -1,
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't remove active NFC ID from testHacker");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});

		it('add active NFC ID', async () => {
			await expect(isNFCUIDAvailable('ACTIVE_NFC_ID_TEST', models)).resolves.toEqual(true);
			await expect(
				registerNFCUIDWithUser('ACTIVE_NFC_ID_TEST', testHackerId.toHexString(), models)
			).rejects.toThrowError(`Associated new NFC ID with user overriding the old NFC ID`);
			const userAfter = await getUser('ACTIVE_NFC_ID_TEST', models);
			if (userAfter != null) await expect(userAfter.secondaryIds[0]).toEqual('ACTIVE_NFC_ID_TEST');
			else throw new MongoError('Could not find user with active nfc id');
		});
	});
	describe('removeUserFromEvent', () => {
		beforeEach(async () => {
			try {
				const ret = await models.Events.findOneAndUpdate(
					{ _id: testEventId },
					{
						$push: {
							attendees: testHackerId.toHexString(),
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't add attendee");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});
		afterEach(async () => {
			try {
				const ret = await models.Events.findOneAndUpdate(
					{ _id: testEventId },
					{
						$set: {
							attendees: [],
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't set attendees to empty");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});

		it('remove using attendee', async () => {
			await expect(
				removeUserFromEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
			).rejects.toThrowError(`has not attended this event`);
			const eventAfter = await models.Events.findOne({ _id: testEventId });
			if (eventAfter != null) expect(eventAfter.attendees).toEqual([]);
			else throw new MongoError('Could not find event');
		});
		it('remove using non-attendee', async () => {
			await expect(
				removeUserFromEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
			).rejects.toThrowError(`has not attended this event`);
			const eventAfter = await models.Events.findOne({ _id: testEventId });
			if (eventAfter != null)
				await expect(eventAfter.attendees).toEqual([testHackerId.toHexString()]);
			else throw new MongoError('Could not find event');
		});
	});
	describe('checkInUserToEvent', () => {
		afterEach(async () => {
			try {
				const ret = await models.Events.findOneAndUpdate(
					{ _id: testEventId },
					{
						$set: {
							attendees: [],
							checkins: [],
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't set attendees array to empty");
				const retusr = await models.Hackers.findOneAndUpdate(
					{ _id: testHackerId },
					{
						$set: {
							eventsAttended: [],
						},
					}
				);
				if (!retusr.value) throw new MongoError("Can't set eventsAttended to empty");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});

		it('add a user', async () => {
			await expect(
				checkInUserToEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
			).resolves.toMatchObject({
				_id: testHackerId,
				eventsAttended: [testEventId.toHexString()],
			});
			const [eventAfter, userAfter] = await Promise.all([
				models.Events.findOne({ _id: testEventId }),
				models.Hackers.findOne({ _id: testHackerId }),
			]);
			if (eventAfter != null && userAfter != null) {
				await expect(eventAfter.attendees).toEqual([testHackerId.toHexString()]);
				await expect(userAfter.eventsAttended).toEqual([testEventId.toHexString()]);
			} else throw new MongoError('Could not find event');
		});

		describe('checkInUserToEventHelper', () => {
			const testCheckIn = {
				_id: ObjectId.createFromTime(Date.now()),
				timestamp: new Date(),
				user: testHackerId.toHexString(),
			};
			beforeEach(async () => {
				try {
					const ret = await models.Events.findOneAndUpdate(
						{ _id: testEventId },
						{
							$set: {
								attendees: [testHackerId.toHexString()],
								checkins: [testCheckIn],
							},
						}
					);
					if (!ret.value) throw new MongoError("Can't set attendees array to empty");
					const retusr = await models.Hackers.findOneAndUpdate(
						{ _id: testHackerId },
						{
							$set: {
								eventsAttended: [testEventId.toHexString()],
							},
						}
					);
					if (!retusr.value) throw new MongoError("Can't set eventsAttended");
				} catch (err) {
					// eslint-disable-next-line no-console
					console.error(err);
				}
			});
			it('add existing user', async () => {
				await expect(
					checkInUserToEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
				).rejects.toThrowError(
					`${testHacker.firstName} ${
						testHacker.lastName
					} (${testHacker._id.toHexString()}) is already checked into event`
				);
				const [eventAfter, userAfter] = await Promise.all([
					models.Events.findOne({ _id: testEventId }),
					models.Hackers.findOne({ _id: testHackerId }),
				]);
				if (eventAfter != null && userAfter != null && userAfter.eventsAttended != null) {
					expect(eventAfter.attendees).toEqual([testHackerId.toHexString()]);
					expect(eventAfter.checkins.length).toEqual(2);
					expect(userAfter.eventsAttended.length).toEqual(1);
				} else throw new MongoError('Could not find event');
			});
		});
	});
	describe('getEventsAttended', () => {
		const testEventsArray = ['TEST_EVENT_1', 'TEST_EVENT_2'];
		beforeAll(async () => {
			try {
				const ret = await models.Hackers.findOneAndUpdate(
					{ _id: testHackerId },
					{
						$set: {
							eventsAttended: testEventsArray,
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't set events attended");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});
		afterAll(async () => {
			try {
				const ret = await models.Hackers.findOneAndUpdate(
					{ _id: testHackerId },
					{
						$set: {
							eventsAttended: [],
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't set events attended");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});
		it('get events attended', async () => {
			await expect(getEventsAttended(testHackerId.toHexString(), models)).resolves.toEqual(
				testEventsArray
			);
		});
	});
	describe('getAttendees', () => {
		const testAttendeesArray = ['TEST_ATTENDEE_1', 'TEST_ATTENDEE_2'];
		beforeAll(async () => {
			try {
				const ret = await models.Events.findOneAndUpdate(
					{ _id: testEventId },
					{
						$set: {
							attendees: testAttendeesArray,
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't set attendees");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});
		afterAll(async () => {
			try {
				const ret = await models.Events.findOneAndUpdate(
					{ _id: testEventId },
					{
						$set: {
							attendees: [],
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't set attendees");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});
		it('get events attended', async () => {
			await expect(getAttendees(testEventId.toHexString(), models)).resolves.toEqual(
				testAttendeesArray
			);
		});
	});
	describe('AddandRemoveAttendeeIntegTest', () => {
		afterAll(async () => {
			try {
				const ret = await models.Events.findOneAndUpdate(
					{ _id: testEventId },
					{
						$set: {
							attendees: [],
							checkins: [],
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't set attendees array to empty");
				const retusr = await models.Hackers.findOneAndUpdate(
					{ _id: testHackerId },
					{
						$set: {
							eventsAttended: [],
						},
					}
				);
				if (!retusr.value) throw new MongoError("Can't set eventsAttended to empty");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});

		it('Add users', async () => {
			await expect(
				checkInUserToEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
			).resolves.toMatchObject({
				_id: testHackerId,
				eventsAttended: [testEventId.toHexString()],
			});
			await expect(
				checkInUserToEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
			).resolves.toMatchObject({
				_id: testHackerId2,
				eventsAttended: [testEventId.toHexString()],
			});
			const [eventAfter, userAfter1, userAfter2] = await Promise.all([
				models.Events.findOne({ _id: testEventId }),
				models.Hackers.findOne({ _id: testHackerId }),
				models.Hackers.findOne({ _id: testHackerId2 }),
			]);
			if (eventAfter != null && userAfter1 != null && userAfter2 != null) {
				expect(eventAfter.attendees).toEqual([
					testHackerId.toHexString(),
					testHackerId2.toHexString(),
				]);
				expect(eventAfter.checkins[0].user).toEqual(testHackerId.toHexString());
				expect(eventAfter.checkins[1].user).toEqual(testHackerId2.toHexString());
				expect(userAfter1.eventsAttended).toEqual([testEventId.toHexString()]);
				expect(userAfter2.eventsAttended).toEqual([testEventId.toHexString()]);
			} else throw new MongoError('Could not find event or users');
		});

		describe('Check attendance helper', () => {
			it('Check users are in attendance', async () => {
				const [event, user1, user2] = await Promise.all([
					models.Events.findOne({ _id: testEventId }),
					models.Hackers.findOne({ _id: testHackerId }),
					models.Hackers.findOne({ _id: testHackerId2 }),
				]);
				if (!event || !user1 || !user2)
					throw new MongoError(`Could not find one of these: ${event} ${user1} ${user2}`);
				expect(userIsAttendingEvent(user1, event)).toEqual(true);
				expect(userIsAttendingEvent(user2, event)).toEqual(true);
				await expect(getAttendees(testEventId.toHexString(), models)).resolves.toEqual([
					testHackerId.toHexString(),
					testHackerId2.toHexString(),
				]);
			});

			describe('Remove users wrapper', () => {
				it('Remove attendees', async () => {
					const [event, user1, user2] = await Promise.all([
						models.Events.findOne({ _id: testEventId }),
						models.Hackers.findOne({ _id: testHackerId }),
						models.Hackers.findOne({ _id: testHackerId2 }),
					]);
					if (!event || !user1 || !user2)
						throw new MongoError(`Could not find one of these: ${event} ${user1} ${user2}`);
					await expect(
						removeUserFromEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
					).resolves.toMatchObject({
						eventsAttended: [],
					});
					expect(userIsAttendingEvent(user2, event)).toEqual(true);
					await expect(
						removeUserFromEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
					).resolves.toMatchObject({
						eventsAttended: [],
					});

					const [eventAfter, userAfter1, userAfter2] = await Promise.all([
						models.Events.findOne({ _id: testEventId }),
						models.Hackers.findOne({ _id: testHackerId }),
						models.Hackers.findOne({ _id: testHackerId2 }),
					]);
					if (eventAfter != null && userAfter1 != null && userAfter2 != null) {
						// Check attendance again
						expect(userIsAttendingEvent(userAfter1, eventAfter)).toEqual(false);
						expect(userIsAttendingEvent(userAfter2, eventAfter)).toEqual(false);

						expect(eventAfter.attendees).toEqual([]);
						expect(eventAfter.checkins.length).toEqual(2);

						// Check eventsAttended is altered
						expect(userAfter1.eventsAttended).toEqual([]);
						expect(userAfter2.eventsAttended).toEqual([]);
					} else throw new MongoError('Could not find event');
				});
			});
		});
	});
	describe('userIsAttendingEvent', () => {
		beforeEach(async () => {
			try {
				await expect(
					checkInUserToEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
				).resolves.toMatchObject({
					_id: testHackerId,
					eventsAttended: [testEventId.toHexString()],
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});
		afterEach(async () => {
			await expect(
				removeUserFromEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
			).resolves.toMatchObject({
				eventsAttended: [],
			});
		});
		it('check user in event', async () => {
			const [hacker, event] = await Promise.all([
				models.Hackers.findOne({ _id: testHackerId }),
				models.Events.findOne({ _id: testEventId }),
			]);
			if (!hacker || !event) throw new Error(`${hacker} ${event}`);
			expect(userIsAttendingEvent(hacker, event)).toEqual(true);
		});
		it('check user not in event', async () => {
			const [hacker, event] = await Promise.all([
				models.Hackers.findOne({ _id: testHackerId2 }),
				models.Events.findOne({ _id: testEventId }),
			]);
			if (!hacker || !event) throw new Error(`${hacker} ${event}`);
			expect(userIsAttendingEvent(hacker, event)).toEqual(false);
		});
	});
	describe('shouldWarnRepeatedCheckIn', () => {
		beforeEach(async () => {
			try {
				await expect(
					checkInUserToEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
				).resolves.toMatchObject({
					_id: testHackerId,
					eventsAttended: [testEventId.toHexString()],
				});
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});
		afterEach(async () => {
			await expect(
				removeUserFromEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
			).resolves.toMatchObject({
				eventsAttended: [],
			});
		});
		it('check event should warn', async () => {
			const [hacker, event] = await Promise.all([
				models.Hackers.findOne({ _id: testHackerId }),
				models.Events.findOne({ _id: testEventId }),
			]);
			if (!hacker || !event) throw new Error(`${hacker} ${event}`);
			expect(shouldWarnRepeatedCheckIn(hacker, event)).toEqual(true);
		});
		it('check user not in event', async () => {
			const [hacker, event] = await Promise.all([
				models.Hackers.findOne({ _id: testHackerId2 }),
				models.Events.findOne({ _id: testEventId }),
			]);
			if (!hacker || !event) throw new Error(`${hacker} ${event}`);
			expect(shouldWarnRepeatedCheckIn(hacker, event)).toEqual(false);
		});
	});
});
