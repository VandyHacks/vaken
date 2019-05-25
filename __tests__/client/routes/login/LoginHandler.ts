import onLogin from '../../../../src/client/routes/login/LoginHandler';

jest.mock('../../../../src/common/ValidationFunctions', () => ({
	emailValidation: () => true,
	passwordValidation: () => true,
}));

describe('Test Loginhandler', () => {
	it('If not redirected, Calls fail callback', done => {
		// jest will wait until callback done() called

		const MOCK_CB = (param: boolean) => {
			expect(param).toBe(true);
			done();
		};
		const MOCK_CB_FAIL = (param: boolean) => {
			expect(param).toBe(true);
			done();
		};
		onLogin('/', 'mock@gmail.com', 'pw', MOCK_CB, MOCK_CB_FAIL);
	});
});
