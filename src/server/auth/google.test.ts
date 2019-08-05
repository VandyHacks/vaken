import { strategy } from './google';
import { Models } from '../models';

describe('Test Google strategy', () => {
	it('has authenticate', async () => {
		expect(strategy(({} as unknown) as Models).authenticate).toBeInstanceOf(Function);
	});
});
