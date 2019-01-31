import React from 'react';
import { Link } from 'react-router-dom';
import LeftImgButton from '../../components/Buttons/LeftImgButton';
import TextButton from '../../components/Buttons/TextButton';
import googleLogo from '../../assets/img/google_logo.svg';
import githubLogo from '../../assets/img/github_logo.svg';
import STRINGS from '../../assets/strings.json';

const OAuthLogin = (): JSX.Element => {
	return (
		<>
			<a href="/api/auth/google" style={{ textDecoration: 'none' }}>
				<LeftImgButton
					color={STRINGS.DARK_TEXT_COLOR}
					img={googleLogo}
					imgAlt="Google logo"
					text="Sign in with Google"
				/>
			</a>
			<a href="/api/auth/github" style={{ textDecoration: 'none' }}>
				<LeftImgButton
					color={STRINGS.DARK_TEXT_COLOR}
					img={githubLogo}
					imgAlt="GitHub logo"
					text="Sign in with GitHub"
				/>
			</a>
			<Link style={{ textDecoration: 'none' }} to="/login/password">
				<TextButton
					color="white"
					fontSize="1.4em"
					background={STRINGS.ACCENT_COLOR}
					text="Sign in with email"
					glowColor="rgba(0, 0, 255, 0.67)"
				/>
			</Link>
		</>
	);
};

export default OAuthLogin;
