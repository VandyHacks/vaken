import TeamResolver from '../../src/server/resolvers/TeamResolver';

import mockingoose from 'mockingoose';
import { TeamModel } from '../../src/server/models/Team';

beforeAll(() => {
	const errFn = () => {
		throw new Error('Team does not exist!');
	};
	mockingoose(TeamModel).toReturn(errFn, 'findOne');
});

describe('Test TeamResolver', () => {
	it('getTeamSize throws error when team name not found', async () => {
		// check for team that doesn't exist
		const num = await TeamResolver.getTeamSize('mockteam');
		expect(num).toThrowError(new Error('Team does not exist!'));
	});
});
