import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import emailIcon from '../../assets/img/email_icon.svg';
import lockIcon from '../../assets/img/lock_icon.svg';
import TextButton from '../../components/Buttons/TextButton';
import STRINGS from '../../assets/strings.json';
import LeftImgTextInput from '../../components/Input/LeftImgTextInput';
import { onChangeWrapper } from '../../components/Input/helperFunctions';
import {
	PASSWORD_REGEX,
	EMAIL_REGEX,
	emailValidation,
	passwordValidation,
} from '../../../common/ValidationFunctions';

/* globals fetch */

/**
 * PasswordLogin is React Hooks component that will display a password login prompt
 * @param {Props} props - currently not used
 * @returns {JSX.Element} a React.Fragment containing inputs and a login button
 */
export const PasswordLogin: React.FunctionComponent = (): JSX.Element => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [passAgain, setPassAgain] = useState('');
	const [invalid, setInvalid] = useState(false);
	const [toDashboard, setToDashboard] = useState(false);

	if (toDashboard) {
		return <Redirect to="/dashboard" />;
	}

	const onLogin = (): void => {
		if (emailValidation(email) && passwordValidation(pass)) {
			fetch('/api/register', {
				body: JSON.stringify({
					password: pass,
					username: email,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
				method: 'POST',
			}).then(
				(res): void => {
					if (res.status === 200 && res.redirected) {
						setToDashboard(true);
					} else {
						setInvalid(true);
					}
				}
			);
		}
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
