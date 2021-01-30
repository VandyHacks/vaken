import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { MyStatusDocument, MyStatusQueryResult, ApplicationStatus } from '../../generated/graphql';
import Component, { HackerTableProps } from './HackerTable';

export default {
	title: 'Routes/Manage/Hacker Table/Hacker Table',
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

export const HackerTable: Story<HackerTableProps> = args => (
	<MockedProvider mocks={makeMocks(ApplicationStatus.Created)}>
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</MockedProvider>
);
