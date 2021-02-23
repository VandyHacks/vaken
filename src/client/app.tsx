import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { createGlobalStyle, DefaultTheme, ThemeProvider } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import reset from 'styled-reset';
import LoginPage from './routes/login/Login';
import Frame from './routes/dashboard/Frame';
import { AuthContext } from './contexts/AuthContext';
import { useMeQuery } from './generated/graphql';
import 'react-toastify/dist/ReactToastify.css';
import { ACCENT_COLOR, DARK_TEXT_COLOR, WARNING_COLOR } from './assets/strings.json';

export const GlobalStyle = createGlobalStyle`
	${reset}

	html, body, #App {
		margin: 0;
		padding: 0;
		font-size: 14px;
		font-family: 'Roboto', sans-serif;
		user-select: none;
	}

	a {
		text-decoration: none;
	}

	/* Styling for the toast messages. The toast library overrides
		 these values so !important is required. */
	.french-toast {
		padding: 20px !important;
		border-radius: 4px !important;
		font-family: 'Roboto', sans-serif !important;
		font-size: 1.1em !important;
	}
`;

export const theme: DefaultTheme = {
	borderRadius: '4px',
	colors: {
		main: ACCENT_COLOR,
		darkTextColor: DARK_TEXT_COLOR,
		lightTextColor: '#ffffff',
		secondary: '#ffffff',
		warning: WARNING_COLOR,
	},
};

toast.configure({ position: 'bottom-right' });

const Vaken: React.FunctionComponent = (): JSX.Element => {
	const [ready, setReady] = useState(false);
	const { data, error, loading } = useMeQuery();

	const StateMachine: React.FunctionComponent = (): JSX.Element | null => {
		if (!ready) return null;
		return data && data.me ? (
			<AuthContext.Provider value={data.me}>
				<Frame />
				<ToastContainer toastClassName="french-toast" autoClose={5000} />
			</AuthContext.Provider>
		) : (
			<LoginPage />
		);
	};

	useEffect(() => {
		if (loading && ready) {
			setReady(false);
		} else if (error && !ready) {
			setReady(true);
		} else if (data && data.me && !ready) {
			setReady(true);
		}
	}, [loading, ready, error, data]);

	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<GlobalStyle />
				<StateMachine />
			</ThemeProvider>
		</BrowserRouter>
	);
};

export default Vaken;
