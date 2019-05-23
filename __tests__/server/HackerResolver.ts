import HackerResolver from '../../src/server/resolvers/HackerResolver';

import mockingoose from 'mockingoose';
import { HackerModel } from '../../src/server/models/Hacker';
import { TeamModel } from '../../src/server/models/Team';
import Status from '../../src/server/enums/Status';

beforeAll(() => {
	mockingoose(HackerModel).toReturn(null, 'findOne');
	mockingoose(HackerModel).toReturn([], 'find');
	mockingoose(TeamModel).toReturn(null, 'findOne');
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
		expect(res).toStrictEqual([]);
	});
	it('get a specific hacker by email', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.hacker(MOCK_EMAIL);
		expect(res).toBeNull();
	});
	it('get all hackers', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.hackers();
		expect(res).toStrictEqual([]);
	});
	it('update hacker', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.updateHackerStatus(MOCK_EMAIL, Status.Started);
		expect(res).toBeNull();
	});
	it('update batch of hackers', async () => {
		// check for team that doesn't exist
		const res = await HackerResolver.updateHackerStatusAsBatch([MOCK_EMAIL], Status.Started);
		expect(res).toEqual(Status.Started);
	});

	// TODO: test updateHackerStatusAsBatch with empty array + array with multiple emails

	it('hacker joining team with bad email', async () => {
		// check for team that doesn't exist
		expect(HackerResolver.joinTeam(MOCK_EMAIL, 'mockteam')).rejects.toEqual(
			new Error('Hacker does not exist!')
		);
	});
	it('hacker joining team with valid email, bad team', async () => {
		mockingoose(HackerModel).toReturn({}, 'findOne');
		// check for team that doesn't exist
		expect(HackerResolver.joinTeam(MOCK_EMAIL, 'mockteam')).rejects.toEqual(
			new Error('Team could not be created!')
		);
	});
});
