import React from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import reset from 'styled-reset';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import LoginPage from './routes/login/Login';
import Frame from './routes/dashboard/Frame';

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

const client = new ApolloClient({ uri: 'http://localhost:8080/graphql' });

const Vaken = (): JSX.Element => {
	return (
		<ApolloProvider client={client}>
			<GlobalStyle />
			<BrowserRouter>
				<Switch>
					<Route path="/login" component={LoginPage} />
					<Route path="/" component={Frame} />
				</Switch>
			</BrowserRouter>
		</ApolloProvider>
	);
};

const app = document.getElementById('App');
ReactDOM.render(<Vaken />, app);

// Copyright (c) 2019 Vanderbilt University
