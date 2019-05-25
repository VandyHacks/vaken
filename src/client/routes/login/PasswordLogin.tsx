import React, { useState, useContext } from 'react';
import emailIcon from '../../assets/img/email_icon.svg';
import lockIcon from '../../assets/img/lock_icon.svg';
import arrowIcon from '../../assets/img/right_arrow.svg';
import TextButton from '../../components/Buttons/TextButton';
import { LeftPaddedImg } from '../../components/Buttons/Buttons';
import { FlexRow, SpaceBetweenColumn } from '../../components/Containers/FlexContainers';
import TextLink from '../../components/Text/TextLink';
import STRINGS from '../../assets/strings.json';
import LeftImgTextInput from '../../components/Input/LeftImgTextInput';
import LoginContext from '../../contexts/LoginContext';
import { onChangeWrapper } from '../../components/Input/helperFunctions';
import { PASSWORD_REGEX, EMAIL_REGEX } from '../../../common/ValidationFunctions';

import onLogin from './LoginHandler';

/**
 * PasswordLogin is React Hooks component that will display a password login prompt
 * @returns {JSX.Element} a React.Fragment containing inputs and a login button
 */
export const PasswordLogin: React.FunctionComponent = (): JSX.Element => {
	const [email, setEmail] = useState('');
	const [pass, setPass] = useState('');
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
			<SpaceBetweenColumn height="10rem">
				<TextButton
					onClick={() => onLogin('/api/login', email, pass, loginCtx.update, setInvalid)}
					color="white"
					marginTop="1.0rem"
					marginBottom="0.5rem"
					fontSize="1.4rem"
					background={STRINGS.ACCENT_COLOR}
					text="Login"
					glowColor="rgba(0, 0, 255, 0.67)"
				/>
				<TextLink to="/login">Forgot Username / Password?</TextLink>
				<FlexRow>
					<TextLink fontSize="1.4rem" color={STRINGS.ACCENT_COLOR} to="/login/create">
						New User ? Create Account
						<LeftPaddedImg src={arrowIcon} alt="Right Arrow" />
					</TextLink>
				</FlexRow>
			</SpaceBetweenColumn>
		</>
	);
};

export default PasswordLogin;
