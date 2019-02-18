import React, { Suspense } from 'react';
import styled from 'styled-components';
import { Switch, Route } from 'react-router-dom';
import Sidebar from '../../components/Sidebar/Sidebar';
import STRINGS from '../../assets/strings.json';
import Title from '../../components/Text/Title';
import HackerDash from './HackerDash';

const OrganizerDash = React.lazy(() => import('./OrganizerDash'));

const Layout = styled.div`
	height: 100vh;
	width: 100vw;
	display: grid;
	grid:
		'sidebar . header' 10vh
		'sidebar . .' 1rem
		'sidebar . content' 1fr
		/ 18rem 2rem 1fr;
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

const Dashboard = (): JSX.Element => {
	return (
		<>
			<Layout>
				<div className="header">
					<Title color={STRINGS.ACCENT_COLOR} margin="1.5rem 0rem 0rem">
						Dashboard
					</Title>
					<Rectangle />
				</div>
				<Sidebar />
				<div className="content">
					<Suspense fallback={<div>Loading...</div>}>
						<Switch>
							<Route path="/dashboard/hacker" component={HackerDash} />
							<Route path="/dashboard/organizer" component={OrganizerDash} />
						</Switch>
					</Suspense>
				</div>
			</Layout>
		</>
	);
};

export default Dashboard;

// Copyright (c) 2019 Vanderbilt University
