import React, { useState, Suspense, FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
// import { useImmer } from 'use-immer';
import { Switch, Redirect, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import STRINGS from '../../assets/strings.json';
import Title from '../../components/Text/Title';
import { routes } from '../../assets/routes';
import { AuthContext } from '../../contexts/AuthContext';
import { SpaceBetweenRow, OverflowContainer } from '../../components/Containers/FlexContainers';
import { ActionButtonContext } from '../../contexts/ActionButtonContext';

export const OrganizerDash = React.lazy(() => import('./OrganizerDash'));

/* eslint-env browser */

const Layout = styled.div`
	height: 100vh;
	width: 100vw;
	display: grid;
	grid:
		'sidebar . . .' 1.5rem
		'sidebar . header .' auto
		'sidebar . . .' 1.5rem
		'sidebar . content .' 1fr
		'sidebar . . .' 1.5rem
		/ 22rem 2rem 1fr 2rem;
	/* align-items: stretch; */
	overflow: hidden;

	.content {
		grid-area: content;
		overflow: auto;
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
	const [ActionButton, setActionButton] = useState<JSX.Element | undefined>(undefined);
	if (window.location.pathname.startsWith('/login')) {
		return <Redirect to="/dashboard" />;
	}

	return (
		<ActionButtonContext.Provider value={{ ActionButton, update: setActionButton }}>
			<Layout>
				<div className="header">
					<SpaceBetweenRow>
						<Title color={STRINGS.ACCENT_COLOR} margin="1.5rem 0rem 0rem">
							<Switch>
								{routes.map(route => {
									return route.authLevel.includes(currentUser.authLevel) ? (
										<Route key={route.path} path={route.path} render={() => route.displayText} />
									) : null;
								})}
							</Switch>
						</Title>
						{ActionButton || null}
					</SpaceBetweenRow>
					<Rectangle />
				</div>
				<Sidebar />
				<OverflowContainer className="content">
					<Suspense fallback={<div>Loading...</div>}>
						<Switch>
							{routes.map(route => {
								return route.authLevel.includes(currentUser.authLevel) ? (
									<Route key={route.path} path={route.path} render={() => <route.component />} />
								) : null;
							})}
						</Switch>
					</Suspense>
				</OverflowContainer>
			</Layout>
		</ActionButtonContext.Provider>
	);
};

export default Frame;
