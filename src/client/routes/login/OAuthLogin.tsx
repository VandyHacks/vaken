import React from 'react';
import LeftImgButton from '../../components/Buttons/LeftImgButton';
import STRINGS from '../../assets/strings.json';

import { authLogos } from '../../plugins';

const OAuthLogin = (): JSX.Element => {
	return (
		<>
			{authLogos.map(({ name, displayName, logo }) => (
				<a href={`/api/auth/${name}`} style={{ textDecoration: 'none' }} key={displayName}>
					<LeftImgButton color={STRINGS.DARK_TEXT_COLOR} img={logo} imgAlt={`${displayName} logo`}>
						{`Sign in with ${displayName}`}
					</LeftImgButton>
				</a>
			))}
		</>
	);
};

export default OAuthLogin;
