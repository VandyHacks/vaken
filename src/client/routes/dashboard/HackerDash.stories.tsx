import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { MyStatusDocument, MyStatusQueryResult, ApplicationStatus } from '../../generated/graphql';
import Component from './HackerDash';

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
			<Component {...args} />
		</MemoryRouter>
	</MockedProvider>
);

export const Started: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Started)}>
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</MockedProvider>
);

export const Submitted: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Submitted)}>
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</MockedProvider>
);

export const Confirmed: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Confirmed)}>
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</MockedProvider>
);

export const Accepted: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Accepted)}>
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</MockedProvider>
);

export const Declined: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Declined)}>
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</MockedProvider>
);

export const Rejected: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Rejected)}>
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</MockedProvider>
);
