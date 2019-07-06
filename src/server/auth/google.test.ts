import strategy from './google';

describe('Test Google strategy', () => {
	it('has authenticate', async () => {
		expect(strategy.strategy.authenticate).toBeInstanceOf(Function);
	});
});
