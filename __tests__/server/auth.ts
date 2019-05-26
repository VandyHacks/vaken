import passport, { createStrategyHandler } from '../../src/server/auth';
import AuthType from '../../src/server/enums/AuthType';
import { Profile as GoogleProfile } from 'passport-google-oauth';

const MOCK_CB = jest.fn();
beforeEach(() => {
	// reset each time
	jest.clearAllMocks();
});

describe('Test passport for authentication', () => {
	it('creates strategy handlers properly', async () => {
		const handler = await createStrategyHandler(AuthType.GOOGLE);
		await handler(null, '', '', ({} as unknown) as GoogleProfile, MOCK_CB);
		expect(handler).toBeTruthy();
		expect(MOCK_CB.mock.calls.length).toBe(1);
	});
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
