import { ObjectId, MongoClient } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { toEnum, checkIsAuthorized, query, queryById, fetchUser, updateUser } from './helpers';
import {
	ShirtSize,
	UserType,
	UserDbInterface,
	HackerDbObject,
	OrganizerDbObject,
} from '../generated/graphql';
import { initDbWithConnStr, Models } from '../models';

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

let mongoServer: MongoMemoryServer;
let mongoClient: MongoClient;
let models: Models;

beforeAll(async () => {
	try {
		mongoServer = new MongoMemoryServer();
		const mongoUri = await mongoServer.getConnectionString();
		models = await initDbWithConnStr(mongoUri);
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
});

afterAll(async () => {
	try {
		if (mongoClient) await mongoClient.close();
		if (mongoServer) await mongoServer.stop();
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error(err);
	}
});

describe('Test resolver helpers', () => {
	describe('toEnum', () => {
		it('correctly coerces members of an enum', () => {
			expect(toEnum(ShirtSize)('XS')).toEqual(ShirtSize.Xs);
		});

		it('throws an error when the item is not in the enum', () => {
			expect(() => void toEnum(ShirtSize)('WUMBO')).toThrow(
				`Invalid enum value: "WUMBO" is not in "["XS","S","M","L","XL","XXL"]"`
			);
		});
	});

	describe('checkIsAuthorized', () => {
		it('throws an error if the user is not a member of the specified group', () => {
			expect(() => void checkIsAuthorized(UserType.Organizer, hacker)).toThrow(
				`user foo@bar.baz: ${JSON.stringify(hacker)} must be a "ORGANIZER"`
			);
		});

		it('throws an error if the user is undefined', () => {
			expect(() => void checkIsAuthorized(UserType.Hacker, undefined)).toThrow(
				'user undefined: undefined must be a "HACKER"'
			);
		});

		it('returns the user object passed in', () => {
			expect(checkIsAuthorized(UserType.Hacker, hacker)).toEqual(hacker);
		});
	});

	describe('query<T>', () => {
		it('throws an error when the item is not found', () => {
			expect(query({ foo: 'bar' }, models.Hackers)).rejects.toThrow(
				'obj with filters: "{"foo":"bar"}" not found in collection "Hackers"'
			);
		});

		it('retrieves an object from the database', async () => {
			const testHacker = ({
				_id: new ObjectId(),
				email: 'foo@bar.com',
			} as unknown) as HackerDbObject;
			await models.Hackers.insertOne(testHacker);

			expect(query({ email: 'foo@bar.com' }, models.Hackers)).resolves.toEqual(testHacker);

			await models.Hackers.drop();
		});
	});

	describe('queryById<T>', () => {
		it('throws an error when the item is not found', async () => {
			const newId = new ObjectId();

			expect(queryById(newId.toHexString(), models.Hackers)).rejects.toThrow(
				`obj with filters: "{"_id":"${newId.toHexString()}"}" not found in collection "Hackers"`
			);
		});

		it('retrieves an object from the database by id', async () => {
			const newId = new ObjectId();
			const testOrganizer = ({
				_id: newId,
				email: 'foo@bar.com',
			} as unknown) as OrganizerDbObject;
			await models.Organizers.insertOne(testOrganizer);

			expect(queryById(newId.toHexString(), models.Organizers)).resolves.toEqual(testOrganizer);

			await models.Organizers.drop();
		});
	});

	describe('fetchUser', () => {
		it('retrieves a hacker from the Hackers collection', async () => {
			const testHacker = ({
				_id: new ObjectId(),
				email: 'foo@bar.com',
			} as unknown) as HackerDbObject;
			await models.Hackers.insertOne(testHacker);

			expect(
				fetchUser({ email: 'foo@bar.com', userType: UserType.Hacker }, models)
			).resolves.toEqual(testHacker);

			await models.Hackers.drop();
		});

		it('retrieves an organizer from the organizers collection', async () => {
			const newId = new ObjectId();
			const testOrganizer = ({
				_id: newId,
				email: 'foo@bar.com',
			} as unknown) as OrganizerDbObject;
			await models.Organizers.insertOne(testOrganizer);

			expect(
				fetchUser({ email: 'foo@bar.com', userType: UserType.Organizer }, models)
			).resolves.toEqual(testOrganizer);

			await models.Organizers.drop();
		});

		it('is not implemented for mentors, sponsors, or superadmins', async () => {
			[UserType.Mentor, UserType.Sponsor, UserType.SuperAdmin].forEach(userType => {
				expect(fetchUser({ email: 'foo@bar.com', userType }, models)).rejects.toThrow(
					`fetchUser for userType ${userType} not implemented`
				);
			});
		});
	});

	describe('updateUser', () => {
		it('returns full object it updated containing the updated fields', async () => {
			const testHacker = ({
				_id: new ObjectId(),
				email: 'foo@bar.com',
			} as unknown) as HackerDbObject;
			await models.Hackers.insertOne(testHacker);

			expect(
				updateUser({ email: 'foo@bar.com', userType: UserType.Hacker }, { lastName: 'baz' }, models)
			).resolves.toMatchObject({ ...testHacker, lastName: 'baz' });

			await models.Hackers.drop();
		});

		it('updates the organizers collection for an organizer', async () => {
			const testOrganizer = ({
				_id: new ObjectId(),
				email: 'foo@bar.com',
			} as unknown) as OrganizerDbObject;
			await models.Organizers.insertOne(testOrganizer);

			expect(
				updateUser(
					{ email: 'foo@bar.com', userType: UserType.Organizer },
					{ lastName: 'bin' },
					models
				)
			).resolves.toMatchObject({ ...testOrganizer, lastName: 'bin' });

			await models.Organizers.drop();
		});

		it('performs enum validation for dietaryRestrictions', async () => {
			const testHacker = ({
				_id: new ObjectId(),
				email: 'foo@bar.com',
			} as unknown) as HackerDbObject;
			await models.Hackers.insertOne(testHacker);

			expect(
				updateUser(
					{ email: 'foo@bar.com', userType: UserType.Hacker },
					{ dietaryRestrictions: 'baz' },
					models
				)
			).rejects.toThrow(
				'Invalid enum value: "baz" is not in "["VEGETARIAN","VEGAN",' +
					'"NUT_ALLERGY","LACTOSE_ALLERGY","GLUTEN_FREE","KOSHER","HALAL"]"'
			);

			expect(
				updateUser(
					{ email: 'foo@bar.com', userType: UserType.Hacker },
					{ dietaryRestrictions: 'HALAL|KOSHER' },
					models
				)
			).resolves.toMatchObject({ ...testHacker, dietaryRestrictions: ['HALAL', 'KOSHER'] });

			await models.Hackers.drop();
		});

		it('performs enum validation for dietaryRestrictions', async () => {
			const testHacker = ({
				_id: new ObjectId(),
				email: 'foo@bar.com',
			} as unknown) as HackerDbObject;
			await models.Hackers.insertOne(testHacker);

			expect(
				updateUser({ email: 'foo@bar.com', userType: UserType.Hacker }, { gender: 'baz' }, models)
			).rejects.toThrow(
				'Invalid enum value: "baz" is not in "["MALE","FEMALE","OTHER","PREFER_NOT_TO_SAY"]"'
			);

			expect(
				updateUser(
					{ email: 'foo@bar.com', userType: UserType.Hacker },
					{ gender: 'FEMALE' },
					models
				)
			).resolves.toMatchObject({ ...testHacker, gender: 'FEMALE' });

			await models.Hackers.drop();
		});

		it('performs enum validation for shirtSize', async () => {
			const testHacker = ({
				_id: new ObjectId(),
				email: 'foo@bar.com',
			} as unknown) as HackerDbObject;
			await models.Hackers.insertOne(testHacker);

			expect(
				updateUser(
					{ email: 'foo@bar.com', userType: UserType.Hacker },
					{ shirtSize: 'baz' },
					models
				)
			).rejects.toThrow('Invalid enum value: "baz" is not in "["XS","S","M","L","XL","XXL"]"');

			expect(
				updateUser({ email: 'foo@bar.com', userType: UserType.Hacker }, { shirtSize: 'XS' }, models)
			).resolves.toMatchObject({ ...testHacker, shirtSize: 'XS' });

			await models.Hackers.drop();
		});

		it('throws an error if the object to be updated does not exit', async () => {
			expect(
				updateUser({ email: 'foo@bar.com', userType: UserType.Hacker }, { lastName: 'baz' }, models)
			).rejects.toThrow('user foo@bar.com not found');
		});

		it('is not implemented for mentors, sponsors, or superadmins', async () => {
			[UserType.Mentor, UserType.Sponsor, UserType.SuperAdmin].forEach(userType => {
				expect(updateUser({ email: 'foo@bar.com', userType }, {}, models)).rejects.toThrow(
					`updateUser for userType ${userType} not implemented`
				);
			});
		});
	});
});
