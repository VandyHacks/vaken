import React, { Suspense, FunctionComponent } from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import Dashboard from './Dashboard';
import Sidebar from '../../components/Sidebar/Sidebar';
import STRINGS from '../../assets/strings.json';
import Title from '../../components/Text/Title';
import HackerDash from './HackerDash';
import Application from '../application/Application';
import ManageHackers from '../manage/ManageHackers';

const OrganizerDash = React.lazy(() => import('./OrganizerDash'));

const Layout = styled.div`
	height: 100vh;
	width: 100vw;
	display: grid;
	grid:
		'sidebar . header' 10vh
		'sidebar . .' 1rem
		'sidebar . content' 1fr
		/ 22rem 2rem 1fr;
	/* align-items: stretch; */
	overflow: hidden;

	.content {
		grid-area: content;
		overflow-y: auto;
		border-radius: 2rem;
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
	return (
		<>
			<Layout>
				<div className="header">
					<Title color={STRINGS.ACCENT_COLOR} margin="1.5rem 0rem 0rem">
						<Switch>
							<Route path="/dashboard" render={() => 'Dashboard'} />
							<Route path="/application" render={() => 'Application'} />
							<Route path="/managehackers" render={() => 'Manage Hackers'} />
						</Switch>
					</Title>
					<Rectangle />
				</div>
				<Sidebar />
				<div className="content">
					<Suspense fallback={<div>Loading...</div>}>
						<Switch>
							<Route path="/dashboard" component={Dashboard} />
							<Route path="/application" component={Application} />
							<Route path="/managehackers" component={ManageHackers} />
						</Switch>
					</Suspense>
				</div>
			</Layout>
		</>
	);
};

export default Frame;

// Copyright (c) 2019 Vanderbilt University
