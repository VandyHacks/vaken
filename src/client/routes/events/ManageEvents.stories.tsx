import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import {
	CompaniesDocument,
	CompaniesQueryResult,
	EventsDocument,
	EventsQueryResult,
} from '../../generated/graphql';
import Component from './ManageEvents';
import { theme } from '../../app';

export default {
	title: 'Routes/Events/Manage Events',
	component: Component,
} as Meta;

const mocks: MockedResponse[] = [
	{
		request: {
			query: CompaniesDocument,
		},
		result: {
			data: {
				companies: [
					{
						tier: { name: 'platinum', id: '1', permissions: ['nfc'] },
						id: '1',
						name: 'Our Favorite Sponsor',
					},
				],
			},
		} as CompaniesQueryResult,
	},
	{
		request: {
			query: EventsDocument,
		},
		result: {
			data: {
				events: [
					{
						duration: 30000,
						eventType: 'checkin',
						id: '1',
						name: 'Example Event',
						startTimestamp: new Date(2021, 1, 1, 1, 1).getTime(),
						owner: { id: '1', name: 'Our Favorite Sponsor' },
					},
				],
			},
		} as EventsQueryResult,
	},
];

export const ManageEvents: Story = args => (
	<ThemeProvider theme={theme}>
		<MockedProvider mocks={mocks}>
			<MemoryRouter>
				<Component {...args} />
			</MemoryRouter>
		</MockedProvider>
	</ThemeProvider>
);
