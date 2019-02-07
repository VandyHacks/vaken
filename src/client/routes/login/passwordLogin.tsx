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
import { emailValidation, passwordValidation } from '../../../common/ValidationFunctions';
import { onChangeWrapper, checkValid } from '../../components/Input/helperFunctions';

interface Props {}
interface State {
	email: string;
	emailValid: boolean; // Validation state for email field. Used for red underline and sending
	pass: string;
	passValid: boolean; // Validation state for password field. Used for red underline and sending
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
