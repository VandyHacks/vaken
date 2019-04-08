import React, { FunctionComponent } from 'react';
import { Route, Switch } from 'react-router-dom';
import STRINGS from '../../assets/strings.json';
import bg from '../../assets/img/login_bg.jpg';
import PasswordLogin from './PasswordLogin';
import OAuthLogin from './OAuthLogin';
import CreateLogin from './CreateLogin';
import Background from '../../components/Containers/Background';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import Title from '../../components/Text/Title';

const LoginPage: FunctionComponent = (): JSX.Element => (
	<>
		<Background img={bg}>
			<FloatingPopup margin="1.5rem" height="25" width="27rem" backgroundOpacity="0.9">
				<Title color={STRINGS.DARK_TEXT_COLOR}>{STRINGS.FULL_NAME}</Title>
				<Switch>
					<Route path="/login/password" component={PasswordLogin} />
					<Route path="/login/create" component={CreateLogin} />
					<Route component={OAuthLogin} />
				</Switch>
			</FloatingPopup>
		</Background>
	</>
);

export default LoginPage;

// Copyright (c) 2019 Vanderbilt University