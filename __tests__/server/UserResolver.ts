import UserResolver from '../../src/server/resolvers/UserResolver';

import mockingoose from 'mockingoose';
import { UserModel } from '../../src/server/models/User';

beforeAll(() => {
	mockingoose(UserModel).toReturn(null, 'findOne');
});
const MOCK_EMAIL = 'mock@gmail.com';

describe('Test UserResolver', () => {
	it('getActiveNfcCode for user', async () => {
		// check for team that doesn't exist
		expect(UserResolver.getActiveNfcCode(MOCK_EMAIL)).rejects.toEqual(
			new Error('User does not exist!')
		);
	});
	it('updateNfcCodes for user', async () => {
		// check for team that doesn't exist
		expect(UserResolver.updateNfcCodes(MOCK_EMAIL, 'newcode')).rejects.toEqual(
			new Error('User does not exist!')
		);
	});
	it('updateUser', async () => {
		// check for team that doesn't exist
		expect(UserResolver.updateUser(MOCK_EMAIL, {})).rejects.toEqual(
			new Error('User does not exist!')
		);
	});

	it('get one user by email', async () => {
		// check for team that doesn't exist
		const res = await UserResolver.user(MOCK_EMAIL);
		expect(res).toBe(undefined);
	});

	it('get all users', async () => {
		// check for team that doesn't exist
		const res = await UserResolver.users();
		expect(res).toStrictEqual([]);
	});
});
