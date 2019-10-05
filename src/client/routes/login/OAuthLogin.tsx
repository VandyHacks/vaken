import React from 'react';
import LeftImgButton from '../../components/Buttons/LeftImgButton';
import googleLogo from '../../assets/img/google_logo.svg';
import githubLogo from '../../assets/img/github_logo.svg';
import msftLogo from '../../assets/img/msft_logo.svg';
import STRINGS from '../../assets/strings.json';

const OAuthLogin = (): JSX.Element => {
	return (
		<>
			<a href="/api/auth/github" style={{ textDecoration: 'none' }}>
				<LeftImgButton color={STRINGS.DARK_TEXT_COLOR} img={githubLogo} imgAlt="GitHub logo">
					Sign in with GitHub
				</LeftImgButton>
			</a>

			<a href="/api/auth/google" style={{ textDecoration: 'none' }}>
				<LeftImgButton color={STRINGS.DARK_TEXT_COLOR} img={googleLogo} imgAlt="Google logo">
					Sign in with Google
				</LeftImgButton>
			</a>

			<a href="/api/auth/microsoft" style={{ textDecoration: 'none' }}>
				<LeftImgButton color={STRINGS.DARK_TEXT_COLOR} img={msftLogo} imgAlt="Microsoft logo">
					Sign in with Microsoft
				</LeftImgButton>
			</a>
		</>
	);
};

export default OAuthLogin;
