import { ObjectId, MongoError } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { query } from '../resolvers/helpers';
import {
	HackerDbObject,
	OrganizerDbObject,
	EventDbObject,
	CompanyDbObject,
	TierDbObject,
} from '../generated/graphql';
import DB, { Models } from '../models';
import {
	checkIfNFCUIDExisted,
	getUser,
	isNFCUIDAvailable,
	registerNFCUIDWithUser,
	removeUserFromEvent,
	checkInUserToEvent,
	userIsAttendingEvent,
	shouldWarnRepeatedCheckIn,
	getEventsAttended,
	getAttendees,
	checkIdentityForEvent,
} from '.';

const event: EventDbObject = {
	_id: new ObjectId(),
	attendees: [],
	checkins: [],
	description: 'description',
	duration: 120,
	eventType: 'event type',
	location: 'location',
	name: 'event',
	startTimestamp: new Date(),
	warnRepeatedCheckins: true,
};

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
const testHackerId2 = new ObjectId();
const testHacker2 = ({
	_id: testHackerId2,
	email: 'foo@bar2.com',
	secondaryIds: ['ACTIVE_NFC_ID_TEST2', 'INACTIVE_NFC_ID_TEST2'],
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

const testCompanyId = new ObjectId();
const testCompany = ({
	_id: testCompanyId,
	name: 'test company',
	tier: { _id: new ObjectId(), name: 'tier', permissions: ['none'] } as TierDbObject,
	eventsOwned: [],
} as unknown) as CompanyDbObject;

beforeAll(async () => {
	try {
		mongoServer = new MongoMemoryServer();
		const mongoUri = await mongoServer.getConnectionString();
		dbClient = new DB(mongoUri);
		models = await dbClient.collections;
		await models.Hackers.insertOne(testHacker);
		await models.Hackers.insertOne(testHacker2);
		await models.Organizers.insertOne(testOrganizer);
		await models.Events.insertOne(testEvent);
		await models.Events.insertOne(event);
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
				event
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
			).resolves.toEqual(testHackerId.toHexString());
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
			).resolves.toEqual(testHackerId.toHexString());
			const eventAfter = await models.Events.findOne({ _id: testEventId });
			if (eventAfter != null) await expect(eventAfter.attendees).toEqual([]);
			else throw new MongoError('Could not find event');
		});
		it('remove using non-attendee', async () => {
			await expect(
				removeUserFromEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
			).resolves.toEqual(null);
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
			).resolves.toEqual(testHackerId.toHexString());
			const eventAfter = await models.Events.findOne({ _id: testEventId });
			const userAfter = await models.Hackers.findOne({ _id: testHackerId });
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
				).resolves.toEqual(testHackerId.toHexString());
				const eventAfter = await models.Events.findOne({ _id: testEventId });
				const userAfter = await models.Hackers.findOne({ _id: testHackerId });
				if (eventAfter != null && userAfter != null && userAfter.eventsAttended != null) {
					await expect(eventAfter.attendees).toEqual([testHackerId.toHexString()]);
					await expect(eventAfter.checkins.length).toEqual(2);
					await expect(userAfter.eventsAttended.length).toEqual(1);
				} else throw new MongoError('Could not find event');
			});
		});
	});
	describe('userIsAttendingEvent', () => {
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
						$push: {
							attendees: '',
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't set attendees");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});
		it('check user in event', async () => {
			await expect(
				userIsAttendingEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
			).resolves.toEqual(true);
		});
		it('check user not in event', async () => {
			await expect(
				userIsAttendingEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
			).resolves.toEqual(false);
		});
	});
	describe('shouldWarnRepeatedCheckIn', () => {
		const testAttendee = testHacker.secondaryIds[0];
		beforeAll(async () => {
			try {
				const ret = await models.Events.findOneAndUpdate(
					{ _id: testEventId },
					{
						$push: {
							attendees: testAttendee,
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't add attendee");
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
						$push: {
							attendees: '',
						},
					}
				);
				if (!ret.value) throw new MongoError("Can't add attendee");
			} catch (err) {
				// eslint-disable-next-line no-console
				console.error(err);
			}
		});
		it('check event should warn', async () => {
			await expect(
				shouldWarnRepeatedCheckIn(testHackerId.toHexString(), testEventId.toHexString(), models)
			).resolves.toEqual(true);
		});
		it('check user not in event', async () => {
			await expect(
				userIsAttendingEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
			).resolves.toEqual(false);
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
			).resolves.toEqual(testHackerId.toHexString());
			await expect(
				checkInUserToEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
			).resolves.toEqual(testHackerId2.toHexString());
			const eventAfter = await models.Events.findOne({ _id: testEventId });
			const userAfter1 = await models.Hackers.findOne({ _id: testHackerId });
			const userAfter2 = await models.Hackers.findOne({ _id: testHackerId2 });
			if (eventAfter != null && userAfter1 != null && userAfter2 != null) {
				await expect(eventAfter.attendees).toEqual([
					testHackerId.toHexString(),
					testHackerId2.toHexString(),
				]);
				await expect(eventAfter.checkins[0].user).toEqual(testHackerId.toHexString());
				await expect(eventAfter.checkins[1].user).toEqual(testHackerId2.toHexString());
				await expect(userAfter1.eventsAttended).toEqual([testEventId.toHexString()]);
				await expect(userAfter2.eventsAttended).toEqual([testEventId.toHexString()]);
			} else throw new MongoError('Could not find event or users');
		});

		describe('Check attendance helper', () => {
			it('Check users are in attendance', async () => {
				await expect(
					userIsAttendingEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
				).resolves.toEqual(true);
				await expect(
					userIsAttendingEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
				).resolves.toEqual(true);
				const eventAfter = await models.Events.findOne({ _id: testEventId });
				if (eventAfter != null)
					await expect(getAttendees(testEventId.toHexString(), models)).resolves.toEqual([
						testHackerId.toHexString(),
						testHackerId2.toHexString(),
					]);
				else throw new MongoError('Could not find event');
			});

			describe('Remove users wrapper', () => {
				it('Remove attendees', async () => {
					await expect(
						removeUserFromEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
					).resolves.toEqual(testHackerId.toHexString());
					await expect(
						userIsAttendingEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
					).resolves.toEqual(true);
					await expect(
						removeUserFromEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
					).resolves.toEqual(testHackerId2.toHexString());

					const eventAfter = await models.Events.findOne({ _id: testEventId });
					const userAfter1 = await models.Hackers.findOne({ _id: testHackerId });
					const userAfter2 = await models.Hackers.findOne({ _id: testHackerId2 });
					if (eventAfter != null && userAfter1 != null && userAfter2 != null) {
						// Check attendance again
						await expect(
							userIsAttendingEvent(testHackerId.toHexString(), testEventId.toHexString(), models)
						).resolves.toEqual(false);
						await expect(
							userIsAttendingEvent(testHackerId2.toHexString(), testEventId.toHexString(), models)
						).resolves.toEqual(false);

						await expect(eventAfter.attendees).toEqual([]);
						await expect(eventAfter.checkins.length).toEqual(2);

						// Check eventsAttended aren't altered
						await expect(userAfter1.eventsAttended).toEqual([testEventId.toHexString()]);
						await expect(userAfter2.eventsAttended).toEqual([testEventId.toHexString()]);
					} else throw new MongoError('Could not find event');
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
					models.Companies.insertOne(testCompany);
				} catch (err) {
					// eslint-disable-next-line no-console
					console.error(err);
				}
			});
			it('Throws error on non-existent company', async () => {
				try {
					await checkIdentityForEvent(
						testEventId.toHexString(),
						testCompanyId.toHexString(),
						models
					);
				} catch (err) {
					expect(err.message).toEqual('Company not found in database');
				}
			});
		});

		it('Return false on non-associated event', async () => {
			await expect(
				checkIdentityForEvent(testEventId.toHexString(), testCompanyId.toHexString(), models)
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
					checkIdentityForEvent(testEventId.toHexString(), testCompanyId.toHexString(), models)
				).resolves.toEqual(true);
			});
		});
	});
});
