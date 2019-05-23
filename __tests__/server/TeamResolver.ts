import TeamResolver from '../../src/server/resolvers/TeamResolver';

beforeAll(() => {
	const app = require('../../src/server/index');
});
describe('Test TeamResolver', () => {
	it('getTeamSize throws error when team name not found', async () => {
		// check for team that doesn't exist
		const num = await TeamResolver.getTeamSize('mockteam');
		expect(num).toThrowError(new Error('Team does not exist!'));
	});
});
