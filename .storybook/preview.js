import React from 'react';
import 'happo-plugin-storybook/register';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyle } from '../src/client/app';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import * as ApplicationMocks from '../src/client/routes/application/application.graphql.mocks';
import * as DashboardsMocks from '../src/client/routes/dashboard/dashboards.graphql.mocks';
import * as EventsMocks from '../src/client/routes/events/events.graphql.mocks';
import * as ManageHackersMocks from '../src/client/routes/manage/hackers.graphql.mocks';
import * as MeMocks from '../src/client/me.graphql.mocks';
import * as ManageSponsorsMocks from '../src/client/routes/manage/sponsor.graphql.mocks';
import * as ProfileMocks from '../src/client/routes/profile/user.graphql.mocks';
import * as TeamMocks from '../src/client/routes/team/teams.graphql.mocks';
import '@storybook/addon-console';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
	Story => (
		<ThemeProvider theme={theme}>
			<Story />
		</ThemeProvider>
	),
	Story => (
		<MemoryRouter>
			<Story />
		</MemoryRouter>
	),
	Story => (
		<>
			<GlobalStyle />
			<Story />
		</>
	),
	Story => (
		<MockedProvider
			mocks={[
				...Object.values(ApplicationMocks),
				...Object.values(DashboardsMocks),
				...Object.values(EventsMocks),
				...Object.values(ManageHackersMocks),
				...Object.values(MeMocks),
				...Object.values(ManageSponsorsMocks),
				...Object.values(ProfileMocks),
				...Object.values(TeamMocks),
			]}>
			<Story />
		</MockedProvider>
	),
];
