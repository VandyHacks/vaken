import { emailValidation, passwordValidation } from '../../../common/ValidationFunctions';

/**
 * @brief Validates and submits login information to server
 * @param {string} username - username/email of user's account
 * @param {string} password - password of user's account
 * @param {function} setInvalidFn - func to update the html response code on error
 * @returns {void}
 */
export const validateAndSubmitLogin = (
	username: string,
	password: string
	// setInvalidFn: React.Dispatch<React.SetStateAction<boolean>>
): void => {
	const emailValid = emailValidation(username);
	const passValid = passwordValidation(password);
	// Do one more check for valid fields (to handle edge case where
	// constructor sets valids to true)
	if (emailValid && passValid) {
		// dummy
	}
};

const onLogin = (
	url: string,
	email: string,
	pass: string,
	updateLogin: Function,
	setInvalid: Function
): void => {
	if (emailValidation(email) && passwordValidation(pass)) {
		fetch(url, {
			body: JSON.stringify({
				password: pass,
				username: email,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		})
			.then(res => {
				if (res.status === 200 && res.redirected) {
					updateLogin(true);
				} else {
					setInvalid(true);
				}
			})
			.catch(err => console.error(err));
	}
};

export default onLogin;
