import { ObjectId } from 'mongodb';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { checkIsAuthorized, fetchUser, query, queryById, toEnum, updateUser } from './helpers';
import {
	HackerDbObject,
	OrganizerDbObject,
	ShirtSize,
	UserDbInterface,
	UserType,
} from '../generated/graphql';
import DB, { Models } from '../models';

const hacker: UserDbInterface = {
	_id: new ObjectId(),
	createdAt: new Date(),
	dietaryRestrictions: '',
	email: 'foo@bar.baz',
	emailUnsubscribed: false,
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

describe('Test resolver helpers', () => {
	describe('toEnum', () => {
		it('correctly coerces members of an enum', () => {
			expect(toEnum(ShirtSize)('XS')).toEqual(ShirtSize.Xs);
		});

		it('throws an error when the item is not in the enum', () => {
			expect(() => void toEnum(ShirtSize)('WUMBO')).toThrow(
				`Invalid enum value: "WUMBO" is not in`
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
				'User is not logged in'
			);
		});

		it('returns the user object passed in', () => {
			expect(checkIsAuthorized(UserType.Hacker, hacker)).toEqual(hacker);
		});
	});

	describe('query<T>', () => {
		it('throws an error when the item is not found', async () => {
			await expect(query({ foo: 'bar' }, models.Hackers)).rejects.toThrow(
				'obj with filters: "{"foo":"bar"}" not found in collection "Hackers"'
			);
		});

		it('retrieves an object from the database', async () => {
			await expect(query({ email: 'foo@bar.com' }, models.Hackers)).resolves.toEqual(testHacker);
		});
	});

	describe('queryById<T>', () => {
		it('throws an error when the item is not found', async () => {
			const newId = new ObjectId();

			await expect(queryById(newId.toHexString(), models.Hackers)).rejects.toThrow(
				`obj with filters: "{"_id":"${newId.toHexString()}"}" not found in collection "Hackers"`
			);
		});

		it('retrieves an object from the database by id', async () => {
			await expect(queryById(testOrganizerId.toHexString(), models.Organizers)).resolves.toEqual(
				testOrganizer
			);
		});
	});

	describe('fetchUser', () => {
		it('retrieves a hacker from the Hackers collection', async () => {
			await expect(
				fetchUser({ email: 'foo@bar.com', userType: UserType.Hacker }, models)
			).resolves.toEqual(testHacker);
		});

		it('retrieves an organizer from the organizers collection', async () => {
			await expect(
				fetchUser({ email: 'foo@bar.com', userType: UserType.Organizer }, models)
			).resolves.toEqual(testOrganizer);
		});

		it('is not implemented for mentors, or superadmins', async () => {
			await Promise.all(
				[UserType.Mentor, UserType.SuperAdmin].map(async userType => {
					await expect(fetchUser({ email: 'foo@bar.com', userType }, models)).rejects.toThrow(
						`fetchUser for userType ${userType} not implemented`
					);
				})
			);
		});
	});

	describe('updateUser', () => {
		it('returns full object it updated containing the updated fields', async () => {
			await expect(
				updateUser({ email: 'foo@bar.com', userType: UserType.Hacker }, { lastName: 'baz' }, models)
			).resolves.toMatchObject({ ...testHacker, lastName: 'baz' });
		});

		it('updates the organizers collection for an organizer', async () => {
			await expect(
				updateUser(
					{ email: 'foo@bar.com', userType: UserType.Organizer },
					{ lastName: 'bin' },
					models
				)
			).resolves.toMatchObject({ ...testOrganizer, lastName: 'bin' });
		});

		// it('performs enum validation for dietaryRestrictions', async () => {
		// 	await expect(
		// 		updateUser(
		// 			{ email: 'foo@bar.com', userType: UserType.Hacker },
		// 			{ dietaryRestrictions: 'baz' },
		// 			models
		// 		)
		// 	).rejects.toThrow(
		// 		'Invalid enum value: "baz" is not in "["VEGETARIAN","VEGAN",' +
		// 			'"NUT_ALLERGY","LACTOSE_ALLERGY","GLUTEN_FREE","KOSHER","HALAL"]"'
		// 	);

		// 	await expect(
		// 		updateUser(
		// 			{ email: 'foo@bar.com', userType: UserType.Hacker },
		// 			{ dietaryRestrictions: 'HALAL|KOSHER' },
		// 			models
		// 		)
		// 	).resolves.toMatchObject({ ...testHacker, dietaryRestrictions: ['HALAL', 'KOSHER'] });
		// });

		// it('performs enum validation for dietaryRestrictions', async () => {
		// 	await expect(
		// 		updateUser({ email: 'foo@bar.com', userType: UserType.Hacker }, { gender: 'baz' }, models)
		// 	).rejects.toThrow(
		// 		'Invalid enum value: "baz" is not in "["MALE","FEMALE","OTHER","PREFER_NOT_TO_SAY"]"'
		// 	);

		// 	await expect(
		// 		updateUser(
		// 			{ email: 'foo@bar.com', userType: UserType.Hacker },
		// 			{ gender: 'FEMALE' },
		// 			models
		// 		)
		// 	).resolves.toMatchObject({ ...testHacker, gender: 'FEMALE' });
		// });

		// it('performs enum validation for shirtSize', async () => {
		// 	await expect(
		// 		updateUser(
		// 			{ email: 'foo@bar.com', userType: UserType.Hacker },
		// 			{ shirtSize: 'baz' },
		// 			models
		// 		)
		// 	).rejects.toThrow('Invalid enum value: "baz" is not in "["XS","S","M","L","XL","XXL"]"');

		// 	await expect(
		// 		updateUser({ email: 'foo@bar.com', userType: UserType.Hacker }, { shirtSize: 'XS' }, models)
		// 	).resolves.toMatchObject({ ...testHacker, shirtSize: 'XS' });
		// });

		it('throws an error if the object to be updated does not exit', async () => {
			await expect(
				updateUser(
					{ email: 'bang@bar.com', userType: UserType.Hacker },
					{ lastName: 'baz' },
					models
				)
			).rejects.toThrow('user bang@bar.com not found');
		});

		it('is not implemented for mentors, sponsors, or superadmins', async () => {
			await Promise.all(
				[UserType.Mentor, UserType.Sponsor, UserType.SuperAdmin].map(async userType => {
					await expect(updateUser({ email: 'foo@bar.com', userType }, {}, models)).rejects.toThrow(
						`updateUser for userType ${userType} not implemented`
					);
				})
			);
		});
	});
});
