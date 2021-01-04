import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
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
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</MockedProvider>
);

export const LoggedInHacker: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={hackerMocks}>
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
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
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
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
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</MockedProvider>
);
