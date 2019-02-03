import React from 'react';
import { Route, Switch } from 'react-router-dom';
import STRINGS from '../../assets/strings.json';
import bg from '../../assets/img/login_bg.jpg';
import PasswordLogin from './passwordLogin';
import OAuthLogin from './OAuthLogin';
import Background from '../../components/Containers/Background';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import Title from '../../components/Text/Title';

const LoginPage = (): JSX.Element => {
	return (
		<>
			<Background img={bg}>
				<FloatingPopup>
					<Title color={STRINGS.DARK_TEXT_COLOR}>{STRINGS.FULL_NAME}</Title>
					<Switch>
						<Route path="/login/password" component={PasswordLogin} />
						<Route component={OAuthLogin} />
					</Switch>
				</FloatingPopup>
			</Background>
		</>
	);
};

export default LoginPage;
