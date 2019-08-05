import { strategy } from './github';
import { Models } from '../models';

describe('Test Github strategy', () => {
	it('has authenticate', async () => {
		expect(strategy(({} as unknown) as Models).authenticate).toBeInstanceOf(Function);
	});
});
