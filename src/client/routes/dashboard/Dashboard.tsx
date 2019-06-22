import React, { FunctionComponent } from 'react';
import { Switch, Route } from 'react-router-dom';
import { HackerDash } from './HackerDash';
import { OrganizerDash } from './OrganizerDash';

export const Dashboard: FunctionComponent = (): JSX.Element => {
	return (
		<>
			<Switch>
				<Route path="/dashboard/organizer" component={OrganizerDash} />
				<Route path="/dashboard" component={HackerDash} />
			</Switch>
		</>
	);
};

export default Dashboard;
