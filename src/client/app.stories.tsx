import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MOCK_HACKER } from '../common/mockObjects';
import Component from './app';
import { MeDocument, MeQueryResult, UserType } from './generated/graphql';

export default {
	title: 'Routes/App',
	component: Component,
} as Meta;

const makeMockUser = (userType: UserType): MockedResponse<NonNullable<MeQueryResult['data']>> => ({
	request: {
		query: MeDocument,
	},
	result: {
		data: {
			me: { ...MOCK_HACKER, userType },
		},
	},
});

export const NotLoggedIn: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[]}>
		<Component {...args} />
	</MockedProvider>
);

export const LoggedInHacker: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[makeMockUser(UserType.Hacker)]}>
		<Component {...args} />
	</MockedProvider>
);

export const LoggedInOrganizer: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[makeMockUser(UserType.Organizer)]}>
		<Component {...args} />
	</MockedProvider>
);

export const LoggedInSponsor: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[makeMockUser(UserType.Sponsor)]}>
		<Component {...args} />
	</MockedProvider>
);
