import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { ThemeProvider } from 'styled-components';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import Component, { GET_STATISTICS } from './OrganizerDash';
import { theme } from '../../app';

export default {
	title: 'Routes/Dashboard/Organizer Dash',
	component: Component,
} as Meta;

const mocks: MockedResponse[] = [
	{
		request: { query: GET_STATISTICS, variables: { number: 5 } },
		result: {
			data: {
				getAllHackerGenders: {
					Male: 10,
					Female: 2,
					Other: 0,
					PreferNotToSay: 1,
				},
				getAllHackerSizes: {
					UXS: 5,
					US: 5,
					UM: 5,
					UL: 5,
					UXL: 5,
					UXXL: 5,
					WS: 5,
					WM: 5,
					WL: 5,
					WXL: 5,
					WXXL: 5,
				},
				getAllHackerStatuses: {
					Created: 10,
					Started: 10,
					Submitted: 10,
					Accepted: 10,
					Confirmed: 10,
					Rejected: 10,
				},
				getTopHackerSchools: [
					{ school: 'Vanderbilt University', counts: 100 },
					{ school: 'University of Illinois', counts: 50 },
					{ school: 'Perdue University', counts: 30 },
					{ school: 'University of Alabama', counts: 20 },
					{ school: 'Northwestern University', counts: 10 },
				],
			},
		},
	},
];

export const OrganizerDash: Story<Record<string, unknown>> = args => (
	<ThemeProvider theme={theme}>
		<MockedProvider mocks={mocks}>
			<MemoryRouter>
				<Component {...args} />
			</MemoryRouter>
		</MockedProvider>
	</ThemeProvider>
);
