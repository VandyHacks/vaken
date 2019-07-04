import React from 'react';
import LeftImgButton from '../../components/Buttons/LeftImgButton';
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
		</>
	);
};

export default OAuthLogin;
