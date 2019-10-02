import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import {
	HackerDbObject,
	OrganizerDbObject,
	ShirtSize,
	UserDbInterface,
	UserType,
} from '../../generated/graphql';
import DB, { Models } from '../../../server/models';
import { getHackers } from './helpers';

const hacker: UserDbInterface = {
	_id: new ObjectId(),
	createdAt: new Date(),
	dietaryRestrictions: '',
	email: 'foo@bar.baz',
	eventsAttended: [],
	firstName: 'Foo',
	lastName: 'Bar',
	logins: [],
	preferredName: 'Foo',
	secondaryIds: [],
	userType: UserType.Hacker,
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

beforeAll(async () => {
	try {
		mongoServer = new MongoMemoryServer();
		const mongoUri = await mongoServer.getConnectionString();
		dbClient = new DB(mongoUri);
		models = await dbClient.collections;
		await models.Hackers.insertOne(testHacker);
		await models.Organizers.insertOne(testOrganizer);
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

describe('test', () => {
	it('getHackers', () => {
		console.log(getHackers());
	});
});
