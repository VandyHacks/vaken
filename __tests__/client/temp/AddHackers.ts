import { addHackers, hackers } from '../../../src/client/temp/AddHackers';

describe('Test AddHackers', () => {
	it('Hackers to add are valid', async () => {
		expect(hackers).toBeInstanceOf(Array);
		hackers.forEach(e => expect(e).toHaveProperty('email'));
	});
	it('Add hackers (die=true) does not throw error', async () => {
		addHackers(true);
		expect(1).toBe(1);
	});
	it('Add hackers (die=false) does not throw error', async () => {
		addHackers(false);
		expect(1).toBe(1);
	});
});
