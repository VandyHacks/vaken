import React, { Suspense, FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import { Switch, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import STRINGS from '../../assets/strings.json';
import Title from '../../components/Text/Title';
import { routes, currentAuth } from '../../assets/routes';
import { AuthContext } from '../../contexts/AuthContext';
import { TableState, defaultTableState, TableContext } from '../../contexts/TableContext';

const OrganizerDash = React.lazy(() => import('./OrganizerDash'));

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
		overflow-y: auto;
		/* border-radius: 2rem; */
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

const Frame: FunctionComponent<{}> = (): JSX.Element => {
	const currentUser = useContext(AuthContext);
	const [tableState, updateTableState] = useImmer<TableState>(defaultTableState);

	return (
		<>
			<TableContext.Provider value={{ state: tableState, update: updateTableState }}>
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
										<Route
											key={route.path}
											path={route.path}
											component={() => <route.component />}
										/>
									) : null;
								})}
							</Switch>
						</Suspense>
					</div>
				</Layout>
			</TableContext.Provider>
		</>
	);
};

export default Frame;

// Copyright (c) 2019 Vanderbilt University
