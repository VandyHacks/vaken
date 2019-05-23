import routes from '../../../src/client/assets/routes';

describe('Test assets/application', () => {
	it('Initializes', async () => {
		expect(routes).toBeTruthy();
		routes.forEach(e => {
			expect(e).toHaveProperty('authLevel');
			expect(e).toHaveProperty('component');
			expect(e).toHaveProperty('displayText');
			expect(e).toHaveProperty('path');
			expect(e.authLevel).toBeInstanceOf(Array);
		});
	});
});
