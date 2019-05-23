import HackerResolver from '../../src/server/resolvers/HackerResolver';

beforeAll(() => {
	const app = require('../../src/server/index');
});
const MOCK_EMAIL = 'mock@gmail.com';

test('Test getAllHackerGenders for hacker', async () => {
	// check for team that doesn't exist
	const res = await HackerResolver.getAllHackerGenders();
	expect(res).toBeTruthy();
});
test('Test getAllHackerSizes for hacker', async () => {
	// check for team that doesn't exist
	const res = await HackerResolver.getAllHackerSizes();
	expect(res).toBeTruthy();
});
test('Test getAllHackerStatuses for hacker', async () => {
	// check for team that doesn't exist
	const res = await HackerResolver.getAllHackerStatuses();
	expect(res).toBeTruthy();
});
test('Test getTopHackerSchools for hacker', async () => {
	// check for team that doesn't exist
	const res = await HackerResolver.getTopHackerSchools(10);
	expect(res).toBeTruthy();
});
test('Test getTopHackerSchools for hacker', async () => {
	// check for team that doesn't exist
	const res = await HackerResolver.getTopHackerSchools(10);
	expect(res).toBeTruthy();
});
test('Test get a specific hacker by email', async () => {
	// check for team that doesn't exist
	const res = await HackerResolver.hacker(MOCK_EMAIL);
	expect(res).toBeNull();
});
test('Test get all hackers', async () => {
	// check for team that doesn't exist
	const res = await HackerResolver.hackers();
	expect(res).toEqual([]);
});
test('Test hacker joining team with bad email', async () => {
	// check for team that doesn't exist
	const res = await HackerResolver.joinTeam(MOCK_EMAIL, 'mockteam');
	expect(res).toEqual(new Error('Hacker does not exist!'));
});
test('Test hacker joining team with valid email, bad team', async () => {
	// check for team that doesn't exist
	const res = await HackerResolver.joinTeam(MOCK_EMAIL, 'mockteam');
	expect(res).toEqual(new Error('Team could not be created!'));
});
