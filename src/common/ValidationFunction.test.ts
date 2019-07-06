// /** DEPRECATED JULY 2019 */
// import { emailValidation, passwordValidation } from './ValidationFunctions';

// describe('Test emailValidation', () => {
// 	it('Test valid email', async () => {
// 		expect(emailValidation('a@a.com')).toBeTruthy();
// 	});
// 	it('Test invalid email', async () => {
// 		// expect(emailValidation('a@com')).toBeFalsy();
// 		expect(emailValidation('a.com')).toBeFalsy();
// 		expect(emailValidation('a')).toBeFalsy();
// 		expect(emailValidation('   ')).toBeFalsy();
// 		expect(emailValidation('')).toBeFalsy();
// 	});
// });
// describe('Test passwordValidation', () => {
// 	it('Test valid password', async () => {
// 		expect(passwordValidation('A12322a!')).toBeTruthy();
// 	});
// 	it('Test reject too short password', async () => {
// 		expect(passwordValidation('A12322a')).toBeFalsy();
// 	});
// 	// it('Test need special char', async () => {
// 	// 	expect(passwordValidation('A12322aa')).toBeFalsy();
// 	// });
// 	it('Test need numbers', async () => {
// 		expect(passwordValidation('aaaaaaaa!')).toBeFalsy();
// 	});
// 	it('Test need letters', async () => {
// 		expect(passwordValidation('11111111!')).toBeFalsy();
// 	});
// 	it('Test cannot be empty', async () => {
// 		expect(passwordValidation('   ')).toBeFalsy();
// 		expect(passwordValidation('')).toBeFalsy();
// 	});
// });
