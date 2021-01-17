import React from 'react';
import styled from 'styled-components';
import { Button } from '../../components/Buttons/Button';

import { authLogos } from '../../plugins';

const ButtonSpacer = styled.div`
	& [role='button'] {
		margin-bottom: 1.6rem;
	}
`;

const OAuthLogin = (): JSX.Element => {
	return (
		<ButtonSpacer>
			{authLogos.map(({ name, displayName, logo }) => (
				<Button
					key={displayName}
					linkTo={`/api/auth/${name}`}
					externalLink
					secondary
					large
					long
					icon={logo}
					iconAlt={`${displayName} logo`}>
					{`Sign in with ${displayName}`}
				</Button>
			))}
		</ButtonSpacer>
	);
};

export default OAuthLogin;
