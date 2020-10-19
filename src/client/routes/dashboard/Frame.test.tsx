import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing';
import { MyStatusDocument } from '../../generated/graphql';
import Frame from './Frame';

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
		},
	},
];

describe('Test Frame', () => {
	it('Frame renders correctly', async () => {
		const component = renderer
			.create(
				<MockedProvider mocks={mocks}>
					<MemoryRouter>
						<Frame />
					</MemoryRouter>
				</MockedProvider>
			)
			.toJSON();

		expect(component).toMatchSnapshot();
	});
});
