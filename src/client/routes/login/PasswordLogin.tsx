import React, { FunctionComponent, useState } from 'react';
import produce from 'immer';
import { Link } from 'react-router-dom';
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
export const PasswordLogin: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');

	const onLogin = (): void => {
		validateAndSubmitLogin(
			email,
			pass,
			checkValid<string>(email, emailValidation),
			checkValid<string>(pass, passwordValidation)
		);
	};

	return (
		<>
			<LeftImgTextInput
				img={emailIcon}
				imgAlt="Email icon"
				onChange={onChangeWrapper(setEmail)}
				value={email}
				placeholder="Email"
			/>
			<LeftImgTextInput
				img={lockIcon}
				imgAlt="Lock icon"
				onChange={onChangeWrapper(setPass)}
				value={pass}
				placeholder="Password"
				type="password"
			/>
			<SpaceBetweenColumn height="10rem">
				<Link style={{ textDecoration: 'none' }} to="/dashboard">
					<TextButton
						onClick={onLogin}
						color="white"
						fontSize="1.4em"
						background={STRINGS.ACCENT_COLOR}
						text="Login"
						glowColor="rgba(0, 0, 255, 0.67)"
					/>
				</Link>
				<TextLink to="/login">Forgot Username / Password?</TextLink>
				<FlexRow>
					<TextLink fontSize="1.4rem" color={STRINGS.ACCENT_COLOR} to="/login/create">
						New User? Create Account
					</TextLink>
					<LeftPaddedImg src={arrowIcon} alt="Right Arrow" />
				</FlexRow>
			</SpaceBetweenColumn>
		</>
	);
};

export default PasswordLogin;

// Copyright (c) 2019 Vanderbilt University
