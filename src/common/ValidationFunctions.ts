// /** DEPRECATED JULY 2019 */

// export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// /**
//  * emailValidation validates that the input e is a valid email address
//  * @param {string} e - input to validate as email address
//  * @returns {boolean} true if e is an email, otherwise false
//  */
// export function emailValidation(e: string): boolean {
// 	// Validate email using regex
// 	return EMAIL_REGEX.test(e);
// }

// export const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
// /**
//  * passwordValidation validates that the input p contains at least 1 symbol (@$!%*#?&),
//  * 1 number, 1 letter, and is at least 8 characters long
//  * @param {string} p - input to validate as password
//  * @returns {boolean} true if p contains a lowercase letter, uppercase letter, , otherwise false
//  */
// export function passwordValidation(p: string): boolean {
// 	// Validate password of length > 8, number, letter, and symbol using regex
// 	return PASSWORD_REGEX.test(p);
// }

// /**
//  * containsAlphaCharacters - makes sure the input string contains some sort of value
//  * @param {string} i - input to validate as containing a 'word'
//  * @returns {boolean} true if p contains some sort of word
//  */
// export function containsAlphaCharacters(i: string): boolean {
// 	return /\w+/.test(i);
// }
