import React, { useState, useContext } from 'react';
import emailIcon from '../../assets/img/email_icon.svg';
import lockIcon from '../../assets/img/lock_icon.svg';
import TextButton from '../../components/Buttons/TextButton';
import STRINGS from '../../assets/strings.json';
import LeftImgTextInput from '../../components/Input/LeftImgTextInput';
import { onChangeWrapper } from '../../components/Input/helperFunctions';
import { PASSWORD_REGEX, EMAIL_REGEX } from '../../../common/ValidationFunctions';
import { LoginContext } from '../../contexts/LoginContext';

import onLogin from './LoginHandler';

/**
 * PasswordLogin is React Hooks component that will display a password login prompt
 * @returns {JSX.Element} a React.Fragment containing inputs and a login button
 */
export const PasswordLogin: React.FunctionComponent = (): JSX.Element => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
	const [passAgain, setPassAgain] = useState('');
	const [invalid, setInvalid] = useState(false);
	const loginCtx = useContext(LoginContext);

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
				onClick={() => onLogin('/api/register/hacker', email, pass, loginCtx.update, setInvalid)}
				marginTop="1.0rem"
				marginBottom="0.5rem"
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
