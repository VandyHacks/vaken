import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import Component from './app';
import { MeDocument, MeQueryResult } from './generated/graphql';

export default {
	title: 'Routes/App',
	component: Component,
} as Meta;

const hackerMocks = [
	{
		request: {
			query: MeDocument,
		},
		result: {
			data: {
				me: {
					id: 'id',
					firstName: 'firstName',
					lastName: 'lastName',
					email: 'email@email.com',
					userType: 'HACKER',
				},
			},
		} as MeQueryResult,
	},
] as MockedResponse[];

export const NotLoggedIn: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={[]}>
		<Component {...args} />
	</MockedProvider>
);

export const LoggedInHacker: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={hackerMocks}>
		<Component {...args} />
	</MockedProvider>
);

const organizerMocks = [
	{
		request: {
			query: MeDocument,
		},
		result: {
			data: {
				me: {
					id: 'id',
					firstName: 'firstName',
					lastName: 'lastName',
					email: 'email@email.com',
					userType: 'ORGANIZER',
				},
			},
		} as MeQueryResult,
	},
] as MockedResponse[];

export const LoggedInOrganizer: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={organizerMocks}>
		<Component {...args} />
	</MockedProvider>
);

const sponsorMocks = [
	{
		request: {
			query: MeDocument,
		},
		result: {
			data: {
				me: {
					id: 'id',
					firstName: 'firstName',
					lastName: 'lastName',
					email: 'email@email.com',
					userType: 'SPONSOR',
				},
			},
		} as MeQueryResult,
	},
] as MockedResponse[];

export const LoggedInSponsor: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={sponsorMocks}>
		<Component {...args} />
	</MockedProvider>
);
