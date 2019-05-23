import UserResolver from '../../src/server/resolvers/UserResolver';

beforeAll(() => {
	const app = require('../../src/server/index');
});
const MOCK_EMAIL = 'mock@gmail.com';

describe('Test UserResolver', () => {
	it('getActiveNfcCode for user', async () => {
		// check for team that doesn't exist
		const res = await UserResolver.getActiveNfcCode(MOCK_EMAIL);
		expect(res).toThrowError(new Error('User does not exist!'));
	});
	it('updateNfcCodes for user', async () => {
		// check for team that doesn't exist
		const res = await UserResolver.updateNfcCodes(MOCK_EMAIL, 'newcode');
		expect(res).toThrowError(new Error('User does not exist!'));
	});
	it('updateUser', async () => {
		// check for team that doesn't exist
		const res = await UserResolver.updateUser(MOCK_EMAIL, {});
		expect(res).toThrowError(new Error('User does not exist!'));
	});

	it('get one user by email', async () => {
		// check for team that doesn't exist
		const res = await UserResolver.user(MOCK_EMAIL);
		expect(res).toBe(undefined);
	});

	it('get all users', async () => {
		// check for team that doesn't exist
		const res = await UserResolver.users();
		expect(res).toBe([]);
	});
});
