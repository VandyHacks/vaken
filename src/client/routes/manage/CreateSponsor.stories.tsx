import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import Component from './CreateSponsor';
import {
	TiersDocument,
	CompaniesDocument,
	TiersQueryResult,
	CompaniesQueryResult,
} from '../../generated/graphql';

export default {
	title: 'Routes/Manage/Create Sponsor',
	component: Component,
} as Meta;

const mocks: MockedResponse[] = [
	{
		request: {
			query: TiersDocument,
		},
		result: {
			data: { tiers: [{ id: '1', name: 'Ultimate', permissions: ['nfc'] }] },
		} as TiersQueryResult,
	},
	{
		request: {
			query: CompaniesDocument,
		},
		result: {
			data: {
				companies: [
					{
						tier: { name: 'Ultimate', id: '1', permissions: ['nfc'] },
						id: '1',
						name: 'Our Favorite Sponsor',
					},
				],
			},
		} as CompaniesQueryResult,
	},
];

export const CreateSponsor: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={mocks}>
		<Component {...args} />
	</MockedProvider>
);
