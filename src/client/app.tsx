import React, { FC } from 'react';
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

const Vaken: FC = () => {
	const { data, error, loading } = useMeQuery();
	const ready = (data?.me || error) && !loading;
	const loggedInUser = data?.me;

	if (!ready) return null;

	return (
		<BrowserRouter>
			<ThemeProvider theme={theme}>
				<GlobalStyle />
				{loggedInUser ? (
					<AuthContext.Provider value={loggedInUser}>
						<Frame />
						<ToastContainer toastClassName="french-toast" autoClose={5000} />
					</AuthContext.Provider>
				) : (
					<LoginPage />
				)}
			</ThemeProvider>
		</BrowserRouter>
	);
};

export default Vaken;
