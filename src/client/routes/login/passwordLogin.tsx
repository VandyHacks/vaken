import React, { FunctionComponent, useState } from 'react';
import emailIcon from '../../assets/img/email_icon.svg';
import lockIcon from '../../assets/img/lock_icon.svg';
import arrowIcon from '../../assets/img/right_arrow.svg';
import TextButton from '../../components/Buttons/TextButton';
import { LeftPaddedImg } from '../../components/Buttons/Buttons';
import { FlexRow, SpaceBetweenColumn } from '../../components/Containers/FlexContainers';
import TextLink from '../../components/Text/TextLink';
import STRINGS from '../../assets/strings.json';
import LeftImgTextInput from '../../components/Input/LeftImgTextInput';

interface Props {}
interface State {
	email: string;
	emailValid: boolean; // Validation state for email field. Used for red underline and sending
	pass: string;
	passValid: boolean; // Validation state for password field. Used for red underline and sending
}

/**
 * onChangeWrapper wraps a setState function to take a react Input event function
 * @param {function} updateFn - function that will update the state
 * @returns {function} function suitable for a react input onChange={} prop
 */
export function onChangeWrapper(
	updateFn: (p: string) => void
): (e: React.ChangeEvent<HTMLInputElement>) => void {
	return (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		updateFn(value);
	};
}

/**
 * emailValidation validates that the input e is a valid email address
 * @param {string} e - input to validate as email address
 * @returns {boolean} true if e is an email, otherwise false
 */
function emailValidation(e: string): boolean {
	// Validate email using regex
	return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e);
}

/**
 * emailValidation validates that the input p contains at least 1 symbol (@$!%*#?&),
 * 1 number, 1 letter, and is at least 8 characters long
 * @param {string} p - input to validate as password
 * @returns {boolean} true if p contains a lowercase letter, uppercase letter, , otherwise false
 */
function passwordValidation(p: string): boolean {
	// Validate password of length > 8, number, letter, and symbol using regex
	return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(p);
}

/**
 * checkValid is a factory method for a validation function
 * @param {T} input - the input on which to run the validation fn
 * @param {function} validFn - function to validate input
 * @param {function} updateFn - function to asynchronously update the state of the valid function
 * @return {function} an event handler function to run to update the valid status of the input
 */
export function checkValid<T>(
	input: T,
	validFn: (p: T) => boolean,
	updateFn: (p: boolean) => void
): () => void {
	return () => updateFn(validFn(input));
}

/**
 * @brief Validates and submits login information to server
 * @param {string} email - username/email of user's account
 * @param {string} password - password of user's account
 * @param {function} emailValidUpdateFn - function to update the valid bit for the email field (optional)
 * @param {function} passValidUpdateFn - function to update the valid bit for the password field (optional)
 * @returns {void}
 */
export const validateAndSubmitLogin = (
	email: string,
	password: string,
	emailValidUpdateFn?: (p: boolean) => void,
	passValidUpdateFn?: (p: boolean) => void
): void => {
	const emailValid = emailValidation(email);
	const passValid = passwordValidation(password);
	// Do one more check for valid fields (to handle edge case where
	// constructor sets valids to true)

	if (emailValidUpdateFn) {
		emailValidUpdateFn(emailValid);
	}
	if (passValidUpdateFn) {
		passValidUpdateFn(passValid);
	}

	if (emailValid && passValid) {
		// TODO: Actually log in instead of console.log
		fetch('/api/login', {
			headers: {
				password: password,
				username: email,
			},
			method: 'POST',
		})
			.then(() => window.alert('Successfully logged in!'))
			.catch(err => console.error('Login error: ', err));
	}
};

/**
 * PasswordLogin is React Hooks component that will display a password login prompt
 * @param {Props} props - currently not used
 * @returns {JSX.Element} a React.Fragment containing inputs and a login button
 */
export const PasswordLogin: FunctionComponent<State> = (props: Props): JSX.Element => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [emailValid, setEmailValid] = useState(true);
	const [passValid, setPassValid] = useState(true);

	return (
		<>
			<LeftImgTextInput
				img={emailIcon}
				imgAlt="Email icon"
				onBlur={checkValid<string>(email, emailValidation, setEmailValid)}
				onChange={onChangeWrapper(setEmail)}
				valid={emailValid}
				value={email}
				placeholder="Email"
			/>
			<LeftImgTextInput
				img={lockIcon}
				imgAlt="Lock icon"
				onBlur={checkValid<string>(pass, passwordValidation, setPassValid)}
				onChange={onChangeWrapper(setPass)}
				valid={passValid}
				value={pass}
				placeholder="Password"
			/>
			<SpaceBetweenColumn height="10rem">
				<TextButton
					color="white"
					fontSize="1.4em"
					background={STRINGS.ACCENT_COLOR}
					text="Login"
					glowColor="rgba(0, 0, 255, 0.67)"
				/>
				<TextLink to="/login">Forgot Username / Password?</TextLink>
				<FlexRow>
					<TextLink fontSize="1.4rem" color={STRINGS.ACCENT_COLOR} to="/login/create">
						New User? Create Account
					</TextLink>
					<LeftPaddedImg src={'/' + arrowIcon} alt="Right Arrow" />
				</FlexRow>
			</SpaceBetweenColumn>
		</>
	);
};

export default PasswordLogin;
