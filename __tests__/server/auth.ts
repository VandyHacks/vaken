describe('Test auth.ts', () => {
	it('Fails without a clientID provided', () => {
		try {
			const passport = require('../../src/server/auth');
		} catch (e) {
			expect(e).toEqual(new TypeError('OAuth2Strategy requires a clientID option'));
		}
	});
});
