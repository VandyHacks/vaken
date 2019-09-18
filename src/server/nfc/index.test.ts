import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
	checkIsAuthorized,
	fetchUser,
	query,
	queryById,
	toEnum,
	updateUser,
} from '../resolvers/helpers';
import {
	HackerDbObject,
	OrganizerDbObject,
	EventDbObject,
	ShirtSize,
	UserDbInterface,
	UserType,
} from '../generated/graphql';
import DB, { Models } from '../models';
import { isNFCUIDAvailable } from '.';

const hacker: UserDbInterface = {
	_id: new ObjectId(),
	createdAt: new Date(),
	dietaryRestrictions: [],
	email: 'foo@bar.baz',
	firstName: 'Foo',
	lastName: 'Bar',
	logins: [],
	preferredName: 'Foo',
	secondaryIds: [],
	userType: UserType.Hacker,
};

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
} as unknown) as EventDbObject;

beforeAll(async () => {
	try {
		mongoServer = new MongoMemoryServer();
		const mongoUri = await mongoServer.getConnectionString();
		dbClient = new DB(mongoUri);
		models = await dbClient.collections;
		await models.Hackers.insertOne(testHacker);
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
});
