import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { createGlobalStyle } from 'styled-components';
import { BrowserRouter } from 'react-router-dom';
import reset from 'styled-reset';
import LoginPage from './routes/login/Login';
import Frame from './routes/dashboard/Frame';
import { AuthContext } from './contexts/AuthContext';
import { useMeQuery } from './generated/graphql';
import 'react-toastify/dist/ReactToastify.css';

const GlobalStyle = createGlobalStyle`
	${reset}

	html, body, #App {
		margin: 0;
		padding: 0;
		width: 100vw;
		height: 100vh;
		font-size: 14px;
		font-family: 'Roboto', sans-serif;
		user-select: none;
		overflow: hidden;
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

toast.configure();

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
			<GlobalStyle />
			<StateMachine />
		</BrowserRouter>
	);
};

export default Vaken;
