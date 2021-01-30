import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { MyStatusDocument, MyStatusQueryResult, ApplicationStatus } from '../../generated/graphql';
import Component from './HackerDash';
import { theme } from '../../app';

export default {
	title: 'Routes/Dashboard/Hacker Dash',
	component: Component,
} as Meta;

function makeMocks(status: ApplicationStatus): MockedResponse[] {
	return [
		{
			request: {
				query: MyStatusDocument,
			},
			result: {
				data: {
					me: {
						id: 'foo',
						status,
						__typename: 'Hacker',
					},
				},
			} as MyStatusQueryResult,
		},
	];
}

export const Created: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Created)}>
		<MemoryRouter>
			<ThemeProvider theme={theme}>
				<Component {...args} />
			</ThemeProvider>
		</MemoryRouter>
	</MockedProvider>
);

export const Started: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Started)}>
		<MemoryRouter>
			<ThemeProvider theme={theme}>
				<Component {...args} />
			</ThemeProvider>
		</MemoryRouter>
	</MockedProvider>
);

export const Submitted: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Submitted)}>
		<MemoryRouter>
			<ThemeProvider theme={theme}>
				<Component {...args} />
			</ThemeProvider>
		</MemoryRouter>
	</MockedProvider>
);

export const Confirmed: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Confirmed)}>
		<MemoryRouter>
			<ThemeProvider theme={theme}>
				<Component {...args} />
			</ThemeProvider>
		</MemoryRouter>
	</MockedProvider>
);

export const Accepted: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Accepted)}>
		<MemoryRouter>
			<ThemeProvider theme={theme}>
				<Component {...args} />
			</ThemeProvider>
		</MemoryRouter>
	</MockedProvider>
);

export const Declined: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Declined)}>
		<MemoryRouter>
			<ThemeProvider theme={theme}>
				<Component {...args} />
			</ThemeProvider>
		</MemoryRouter>
	</MockedProvider>
);

export const Rejected: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Rejected)}>
		<MemoryRouter>
			<ThemeProvider theme={theme}>
				<Component {...args} />
			</ThemeProvider>
		</MemoryRouter>
	</MockedProvider>
);
