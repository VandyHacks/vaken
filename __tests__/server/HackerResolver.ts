import HackerResolver from '../../src/server/resolvers/HackerResolver';

beforeAll(() => {
	const app = require('../../src/server/index');
});
const MOCK_EMAIL = 'mock@gmail.com';

describe('HackerResolver', () => {
	it('getAllHackerGenders', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.getAllHackerGenders();
		expect(res).toBeTruthy();
	});
	it('getAllHackerSizes', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.getAllHackerSizes();
		expect(res).toBeTruthy();
	});
	it('getAllHackerStatuses', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.getAllHackerStatuses();
		expect(res).toBeTruthy();
	});
	it('getTopHackerSchools', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.getTopHackerSchools(10);
		expect(res).toBeTruthy();
	});
	it('getTopHackerSchools', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.getTopHackerSchools(10);
		expect(res).toBeTruthy();
	});
	it('get a specific hacker by email', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.hacker(MOCK_EMAIL);
		expect(res).toBeNull();
	});
	it('get all hackers', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.hackers();
		expect(res).toEqual([]);
	});
	it('hacker joining team with bad email', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.joinTeam(MOCK_EMAIL, 'mockteam');
		expect(res).toEqual(new Error('Hacker does not exist!'));
	});
	it('hacker joining team with valid email, bad team', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.joinTeam(MOCK_EMAIL, 'mockteam');
		expect(res).toEqual(new Error('Team could not be created!'));
	});
});
