import addHackers, { hackers } from '../../../src/client/temp/AddHackers';

describe('Test AddHackers', () => {
	it('Hackers to add are valid', async () => {
		expect(hackers).toBeInstanceOf(Array);
		hackers.forEach(e => expect(e).toHaveProperty('email'));
	});
	it('Add hackers (die=true) calls fetch method', async () => {
		try {
			addHackers(true);
		} catch (e) {
			// TODO: mock fetch
			expect(e).toStrictEqual(new ReferenceError('fetch is not defined'));
		}
	});
	it('Add hackers (die=false) calls fetch method', async () => {
		try {
			addHackers(false);
		} catch (e) {
			// TODO: mock fetch
			expect(e).toStrictEqual(new ReferenceError('fetch is not defined'));
		}
	});
});
