import React from 'react';
import renderer from 'react-test-renderer';
import { MockedProvider } from '@apollo/react-testing';
import { MyApplicationDocument } from '../../generated/graphql';

import { Application } from './Application';

jest.mock('../../assets/data/institutions.json', () => ['Vanderbilt University']);

const mocks = [
	{
		request: {
			query: MyApplicationDocument,
		},
		result: {
			data: {
				me: {
					application: [{ answer: 'testing', question: 'First Name' }],
					id: 'foo',
				},
			},
		},
	},
];

describe('Test Application', () => {
	it(' renders correctly', async () => {
		const component = renderer
			.create(
				<MockedProvider mocks={mocks}>
					<Application />
				</MockedProvider>
			)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
