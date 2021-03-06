import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MOCK_HACKER } from '../../../common/mockObjects';
import { MyStatusDocument, MyStatusQueryResult, ApplicationStatus } from '../../generated/graphql';
import Component from './HackerDash';

export default {
	title: 'Routes/Dashboard/Hacker Dash',
	component: Component,
} as Meta;

const makeMocks = (
	status: ApplicationStatus
): MockedResponse<NonNullable<MyStatusQueryResult['data']>> => ({
	request: {
		query: MyStatusDocument,
	},
	result: {
		data: {
			me: { ...MOCK_HACKER, status },
		},
	},
});

export const Created: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[makeMocks(ApplicationStatus.Created)]}>
		<Component {...args} />
	</MockedProvider>
);

export const Started: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[makeMocks(ApplicationStatus.Started)]}>
		<Component {...args} />
	</MockedProvider>
);

export const Submitted: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[makeMocks(ApplicationStatus.Submitted)]}>
		<Component {...args} />
	</MockedProvider>
);

export const Confirmed: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[makeMocks(ApplicationStatus.Confirmed)]}>
		<Component {...args} />
	</MockedProvider>
);

export const Accepted: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[makeMocks(ApplicationStatus.Accepted)]}>
		<Component {...args} />
	</MockedProvider>
);

export const Declined: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[makeMocks(ApplicationStatus.Declined)]}>
		<Component {...args} />
	</MockedProvider>
);

export const Rejected: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[makeMocks(ApplicationStatus.Rejected)]}>
		<Component {...args} />
	</MockedProvider>
);
