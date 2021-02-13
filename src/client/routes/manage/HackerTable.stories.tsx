import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { useImmer } from 'use-immer';
import { defaultTableState, TableContext } from '../../contexts/TableContext';
import {
	ApplicationStatus,
	DetailedHackerDocument,
	DetailedHackerQueryResult,
	EventsDocument,
	EventsQueryResult,
	SignedReadUrlDocument,
	SignedReadUrlQueryResult,
	UserType,
} from '../../generated/graphql';
import Component, { HackerTableProps } from './HackerTable';

const mocks: MockedResponse[] = [
	{
		request: { query: EventsDocument, variables: {} },
		result: { data: { events: {} } } as EventsQueryResult,
	},
	{
		request: { query: DetailedHackerDocument },
		result: {
			data: {
				hacker: {
					email: 'email@email.com',
					dietaryRestrictions: 'HALAL|VEGAN',
					application: {},
					firstName: 'firstName',
					lastName: 'lastName',
					id: 'id',
					majors: ['Majors'],
					modifiedAt: Date.now(),
					race: '',
					status: ApplicationStatus.Accepted,
					userType: UserType.Hacker,
				},
			},
		} as DetailedHackerQueryResult,
	},
	{
		request: { query: SignedReadUrlDocument },
		result: {
			data: { signedReadUrl: 'https://vandyhacks.org' },
		} as SignedReadUrlQueryResult,
	},
];

export default {
	title: 'Routes/Manage/Hacker Table/Hacker Table',
	component: Component,
	decorators: [
		StoryComponent => (
			<MockedProvider mocks={mocks}>
				<StoryComponent />
			</MockedProvider>
		),
	],
} as Meta;

// TableContext works better inside the story than as a story decorator because
// the latter method forcibly re-renders the entire story when changed.
const HackerTable: Story<HackerTableProps> = args => {
	const [tableState, setTableState] = useImmer(defaultTableState);
	return (
		<TableContext.Provider value={{ state: tableState, update: setTableState }}>
			<Component {...args} />
		</TableContext.Provider>
	);
};

export const WithFakeData: Story<HackerTableProps> = args => <HackerTable {...args} />;
WithFakeData.args = {
	data: [
		{
			id: 'foo',
			firstName: 'firstName',
			lastName: 'lastName',
			email: 'email@email.com',
			eventsAttended: [],
			status: ApplicationStatus.Created,
			gradYear: '2024',
			school: 'Vanderbilt University',
			__typename: 'Hacker',
		},
		{
			id: 'foo',
			firstName: 'firstName',
			lastName: 'lastName',
			email: 'email@email.com',
			eventsAttended: [],
			status: ApplicationStatus.Created,
			gradYear: '2024',
			school: 'Vanderbilt University',
			__typename: 'Hacker',
		},
		{
			id: 'foo',
			firstName: 'firstName',
			lastName: 'lastName',
			email: 'email@email.com',
			eventsAttended: [],
			status: ApplicationStatus.Created,
			gradYear: '2024',
			school: 'Vanderbilt University',
			__typename: 'Hacker',
		},
	],
	isSponsor: false,
	viewResumes: true,
};

export const SponsorView: Story<HackerTableProps> = args => <HackerTable {...args} />;
SponsorView.args = {
	data: [
		{
			id: 'foo',
			firstName: 'firstName',
			lastName: 'lastName',
			email: 'email@email.com',
			eventsAttended: [],
			status: ApplicationStatus.Created,
			gradYear: '2024',
			school: 'Vanderbilt University',
		},
	],
	isSponsor: true,
};

export const WithResumes: Story<HackerTableProps> = args => <HackerTable {...args} />;
WithResumes.args = {
	data: [
		{
			id: 'foo',
			firstName: 'firstName',
			lastName: 'lastName',
			email: 'email@email.com',
			eventsAttended: [],
			status: ApplicationStatus.Created,
			gradYear: '2024',
			school: 'Vanderbilt University',
		},
	],
	viewResumes: true,
};
