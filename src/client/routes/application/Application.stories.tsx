import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import Component from './Application';
import { MyApplicationQueryResult, MyApplicationDocument } from '../../generated/graphql';

export default {
	title: 'Routes/Application/Application',
	component: Component,
} as Meta;

const mocks = [
	{
		request: {
			query: MyApplicationDocument,
		},
		result: {
			data: {
				me: {
					id: 'id',
					status: 'SUBMITTED',
					__typename: 'Hacker',
					application: [
						{ question: 'firstName', answer: 'Daddy' },
						{ question: 'lastName', answer: 'VandyHacks' },
						{ question: 'gender', answer: 'MALE' },
						{ question: 'phoneNumber', answer: '7777777777' },
						{ question: 'dateOfBirth', answer: '2021-01-01' },
						{ question: 'school', answer: 'Vanderbilt University' },
						{ question: 'major', answer: 'Computer Science' },
						{ question: 'gradYear', answer: '2021' },
						{ question: 'race', answer: 'Asian|Other' },
					],
				},
			},
		} as MyApplicationQueryResult,
	},
] as MockedResponse[];

export const Application: Story<Record<string, unknown>> = args => (
	<MockedProvider mocks={mocks}>
		<Component {...args} />
	</MockedProvider>
);
