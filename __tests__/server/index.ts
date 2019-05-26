import UserResolver from '../../src/server/resolvers/UserResolver';
import HackerResolver from '../../src/server/resolvers/HackerResolver';
import MentorResolver from '../../src/server/resolvers/MentorResolver';
import OrganizerResolver from '../../src/server/resolvers/OrganizerResolver';
import SponsorRepResolver from '../../src/server/resolvers/SponsorRepResolver';
import SponsorResolver from '../../src/server/resolvers/SponsorResolver';
import TeamResolver from '../../src/server/resolvers/TeamResolver';

import app from '../../src/server/index';

const resolvers = [
	'UserResolver',
	'HackerResolver',
	'MentorResolver',
	'OrganizerResolver',
	'SponsorRepResolver',
	'SponsorResolver',
	'TeamResolver',
];
resolvers.forEach(r => {
	jest.mock(r, () => ({}));
});
// mock router
jest.mock('../../src/server/api/UserRouter', () => ({
	middleware: () => {},
	routes: () => {},
}));

// jest.mock('User', () => {});
describe('Test main server', () => {
	it('Setup properly', async () => {
		expect(app).toBeTruthy();
	});
});
