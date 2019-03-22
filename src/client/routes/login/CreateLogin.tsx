import React, { useState } from 'react';
import emailIcon from '../../assets/img/email_icon.svg';
import lockIcon from '../../assets/img/lock_icon.svg';
import arrowIcon from '../../assets/img/right_arrow.svg';
import TextButton from '../../components/Buttons/TextButton';
import { LeftPaddedImg } from '../../components/Buttons/Buttons';
import { FlexRow, SpaceBetweenColumn } from '../../components/Containers/FlexContainers';
import TextLink from '../../components/Text/TextLink';
import STRINGS from '../../assets/strings.json';
import LeftImgTextInput from '../../components/Input/LeftImgTextInput';
import { onChangeWrapper } from '../../components/Input/helperFunctions';
import {
	PASSWORD_REGEX,
	EMAIL_REGEX,
	emailValidation,
	passwordValidation,
} from '../../../common/ValidationFunctions';

interface Props {}

/**
 * @brief Validates and submits login information to server
 * @param {string} username - username/email of user's account
 * @param {string} password - password of user's account
 * @param {function} setInvalidFn - func to update the html response code on error
 * @returns {void}
 */
export const validateAndCreateUser = (
	username: string,
	password: string,
	setInvalidFn: React.Dispatch<React.SetStateAction<boolean>>
): void => {
	const emailValid = emailValidation(username);
	const passValid = passwordValidation(password);
	// Do one more check for valid fields (to handle edge case where
	// constructor sets valids to true)

	if (emailValid && passValid) {
		// TODO: Actually log in instead of console.log
		fetch('/api/register', {
			body: JSON.stringify({
				password,
				username,
			}),
			headers: {
				'Content-Type': 'application/json',
			},
			method: 'POST',
		}).then(res => {
			switch (res.status) {
				case 401:
					setInvalidFn(true);
					break;
				default:
					console.log('logged in?');
					break;
			}
		});
	}
};

/**
 * PasswordLogin is React Hooks component that will display a password login prompt
 * @param {Props} props - currently not used
 * @returns {JSX.Element} a React.Fragment containing inputs and a login button
 */
export const PasswordLogin: React.FunctionComponent<Props> = (): JSX.Element => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [passAgain, setPassAgain] = useState('');
	const [invalid, setInvalid] = useState(false);

	const onLogin = (): void => {
		validateAndCreateUser(email, pass, setInvalid);
	};

	return (
		<>
			<LeftImgTextInput
				img={emailIcon}
				imgAlt="Email icon"
				fontSize="1.2rem"
				onChange={onChangeWrapper(setEmail)}
				value={email}
				placeholder="Email"
				pattern={EMAIL_REGEX.source}
			/>
			<LeftImgTextInput
				img={lockIcon}
				imgAlt="Lock icon"
				fontSize="1.2rem"
				onChange={onChangeWrapper(setPass)}
				value={pass}
				placeholder="Password"
				type="password"
				pattern={PASSWORD_REGEX.source}
				invalid={invalid}
			/>
			<LeftImgTextInput
				img={lockIcon}
				imgAlt="Lock icon"
				fontSize="1.2rem"
				onChange={onChangeWrapper(setPassAgain)}
				value={passAgain}
				placeholder="Password (Again)"
				type="password"
				pattern={PASSWORD_REGEX.source}
				invalid={invalid}
			/>
			<TextButton
				onClick={onLogin}
				color="white"
				fontSize="1.4rem"
				background={STRINGS.ACCENT_COLOR}
				text="Create Account"
				glowColor="rgba(0, 0, 255, 0.67)"
			/>
		</>
	);
};

export default PasswordLogin;

// Copyright (c) 2019 Vanderbilt University
