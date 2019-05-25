import passport from '../../src/server/auth';
const MOCK_CB = jest.fn();
beforeEach(() => {
	// reset each time
	jest.clearAllMocks();
});

describe('Test passport for authentication', () => {
	it('authorizes with google strategy', async () => {
		await passport.authenticate('google', MOCK_CB);
		expect(MOCK_CB.mock.calls.length).toBe(0);
	});
	it('authorizes with github strategy', async () => {
		await passport.authenticate('github', MOCK_CB);
		expect(MOCK_CB.mock.calls.length).toBe(0);
	});
	it('authorizes with local strategy', async () => {
		await passport.authenticate('local', MOCK_CB);
		expect(MOCK_CB.mock.calls.length).toBe(0);
	});
});
