import { strategy } from './github';

describe('Test Github strategy', () => {
	it('has authenticate', async () => {
		expect(strategy.authenticate).toBeInstanceOf(Function);
	});
});
