import React, { Suspense, FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import { Switch, Redirect, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import STRINGS from '../../assets/strings.json';
import Title from '../../components/Text/Title';
import { routes } from '../../assets/routes';
import { AuthContext } from '../../contexts/AuthContext';

export const OrganizerDash = React.lazy(() => import('./OrganizerDash'));

const Layout = styled.div`
	height: 100vh;
	width: 100vw;
	display: grid;
	grid:
		'sidebar . header .' auto
		'sidebar . . .' 1.5rem
		'sidebar . content .' 1fr
		'sidebar . . .' 1.5rem
		/ 22rem 2rem 1fr 2rem;
	/* align-items: stretch; */
	overflow: hidden;

	.content {
		grid-area: content;
		max-height: 100%;
		/* border-radius: 2rem; */
		overflow: auto;
	}

	.header {
		grid-area: header;
	}
`;

const Rectangle = styled.div`
	height: 0.4rem;
	width: 7.5rem;
	background: ${STRINGS.ACCENT_COLOR};
`;

const Frame: FunctionComponent = (props): JSX.Element => {
	const currentUser = useContext(AuthContext);

	if (window.location.pathname.startsWith('/login')) {
		return <Redirect to="/dashboard" />;
	}

	return (
		<>
			<Layout>
				<div className="header">
					<Title color={STRINGS.ACCENT_COLOR} margin="1.5rem 0rem 0rem">
						<Switch>
							{routes.map(route => {
								return route.authLevel.includes(currentUser.authLevel) ? (
									<Route key={route.path} path={route.path} render={() => route.displayText} />
								) : null;
							})}
						</Switch>
					</Title>
					<Rectangle />
				</div>
				<Sidebar />
				<div className="content">
					<Suspense fallback={<div>Loading...</div>}>
						<Switch>
							{routes.map(route => {
								return route.authLevel.includes(currentUser.authLevel) ? (
									<Route key={route.path} path={route.path} render={() => <route.component />} />
								) : null;
							})}
						</Switch>
					</Suspense>
				</div>
			</Layout>
		</>
	);
};

export default Frame;

// Copyright (c) 2019 Vanderbilt University
