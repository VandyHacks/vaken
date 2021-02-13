import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MyStatusDocument, MyStatusQueryResult } from '../../generated/graphql';
import Component from './Frame';
import { theme } from '../../app';

export default {
	title: 'Routes/Dashboard/Frame',
	component: Component,
} as Meta;

const mocks = [
	{
		request: {
			query: MyStatusDocument,
		},
		result: {
			data: {
				me: {
					id: 'foo',
					status: 'SUBMITTED',
				},
			},
		} as MyStatusQueryResult,
	},
] as MockedResponse[];

export const Frame: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={mocks}>
		<Component {...args} />
	</MockedProvider>
);
