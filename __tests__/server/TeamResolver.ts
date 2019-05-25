import mockingoose from 'mockingoose';
import { TeamModel } from '../../src/server/models/Team';
import TeamResolver from '../../src/server/resolvers/TeamResolver';

beforeAll(() => {});

describe('Test TeamResolver', () => {
	it('getTeamSize throws error when team name not found', async () => {
		mockingoose(TeamModel).toReturn(null, 'findOne');
		// check for team that doesn't exist

		// toThrow doesn't work for async funcs https://github.com/facebook/jest/issues/1700
		expect(TeamResolver.getTeamSize('mockteam')).rejects.toEqual(new Error('Team does not exist!'));
	});
});
