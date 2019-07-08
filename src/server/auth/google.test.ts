import { strategy } from './google';

describe('Test Google strategy', () => {
	it('has authenticate', async () => {
		expect(strategy.authenticate).toBeInstanceOf(Function);
	});
});
