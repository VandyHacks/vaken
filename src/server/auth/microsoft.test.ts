import { strategy } from './microsoft';
import { Models } from '../models';

describe('Test microsoft strategy', () => {
	it('has authenticate', async () => {
		expect(strategy(({} as unknown) as Models).authenticate).toBeInstanceOf(Function);
	});
});
