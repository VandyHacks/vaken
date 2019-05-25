import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import reset from 'styled-reset';
import ApolloClient from 'apollo-boost';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloProvider } from 'react-apollo';
import LoginPage from './routes/login/Login';
import Frame from './routes/dashboard/Frame';
import AuthContext from './contexts/AuthContext';
import LoginContext from './contexts/LoginContext';
import { User } from '../common/models/User';

const GlobalStyle = createGlobalStyle`
	body {
		@import url('https://fonts.googleapis.com/css?family=Roboto+Condensed:300,400,500|Roboto:300,400,500,700');
		font-family: 'Roboto', sans-serif;

		${reset}
	user-select: none;
		margin: 0;
		padding: 0;
		width: 100vw;
		height: 100vh;
		font-size: 12px;
	}
`;

const client = new ApolloClient({ uri: 'http://localhost:8080/graphql' });

const Vaken: React.FunctionComponent = (): JSX.Element => {
	const [loggedIn, setLoggedIn] = useState();
	const [ready, setReady] = useState();
	const [user, setUser] = useState(new User());

	const stateMachine: React.FunctionComponent = (): JSX.Element | null => {
		if (!ready) return null;
		return loggedIn ? (
			<AuthContext.Provider value={user}>
				<Frame />
			</AuthContext.Provider>
		) : (
			<LoginContext.Provider value={{ state: loggedIn, update: setLoggedIn }}>
				<LoginPage />
			</LoginContext.Provider>
		);
	};

	// Uncomment to add dummy data
	// useEffect(() => {
	// addHackers(true);
	// }, []);

	useEffect(() => {
		fetch('/api/whoami').then(res => {
			if (res.status === 200) {
				res.json().then(body => {
					setUser(body);
					setLoggedIn(true);
					setReady(true);
				});
			} else {
				setReady(true);
			}
		});
	}, [loggedIn]);

	return (
		<ApolloProvider client={client}>
			<ApolloHooksProvider client={client}>
				<GlobalStyle />
				<BrowserRouter>{stateMachine}</BrowserRouter>
			</ApolloHooksProvider>
		</ApolloProvider>
	);
};

const app = document.getElementById('App');
ReactDOM.render(<Vaken />, app);
