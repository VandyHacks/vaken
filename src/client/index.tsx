import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reset from 'styled-reset';
import LoginPage from './routes/login/login';
import Dashboard from './routes/dashboard/dashboard';

const GlobalStyle = createGlobalStyle`
	body {
		@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,500|Roboto:300,400,500,700');
		font-family: 'Roboto', sans-serif;

		${reset}
		margin: 0;
		padding: 0;
		width: 100vw;
		height: 100vh;
		font-size: 12px;
	}
`;

const Vaken = (): JSX.Element => {
	return (
		<>
			<GlobalStyle />
			<BrowserRouter>
				<Switch>
					<Route path="/" component={LoginPage} />
					<Route path="/dashboard" component={Dashboard} />
				</Switch>
			</BrowserRouter>
		</>
	);
};

const app = document.getElementById('App');
ReactDOM.render(<Vaken />, app);
