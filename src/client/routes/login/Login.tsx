import React, { FunctionComponent } from 'react';
import STRINGS from '../../assets/strings.json';
import bg from '../../assets/img/login_bg.jpg';
import OAuthLogin from './OAuthLogin';
import Background from '../../components/Containers/Background';
import TextButton from '../../components/Buttons/TextButton';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { Title } from '../../components/Text/Title';

const LoginPage: FunctionComponent = (): JSX.Element => (
	<>
		<Background img={bg}>
			<FloatingPopup margin="1.5rem" height="25" width="27rem" backgroundOpacity="0.9">
				<Title color={STRINGS.DARK_TEXT_COLOR} textAlign="center">
					{STRINGS.FULL_NAME}
				</Title>
				<OAuthLogin />
				<a href={`https://summer.vandyhacks.org`} style={{ textDecoration: 'none' }}>
					<TextButton color={STRINGS.DARK_TEXT_COLOR}>
						{`Learn more`}
					</TextButton>
				</a>
			</FloatingPopup>
		</Background>
	</>
);

export default LoginPage;
