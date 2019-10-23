import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/react-testing';
import NfcTable from './NfcTable';
import { ApplicationStatus } from '../../generated/graphql';

// NOTE: mock() must be called OUTSIDE the describe() methods b/c hoisted to top of scope
// see https://github.com/facebook/jest/issues/2582
jest.mock('react-selectable-fast', () => ({
	SelectableGroup: () => 'SelectableGroup',
}));
jest.mock('./Row', () => () => 'Row');

test.skip('Test NfcTable', () => {
	it('renders correctly', async () => {
		const component = renderer
			.create(
				<MemoryRouter>
					<MockedProvider mocks={[]}>
						<NfcTable
							hackersData={[
								{
									email: 'fakeemail@gmail.com',
									firstName: 'a',
									id: 'foo',
									lastName: 'a',
									status: ApplicationStatus.Accepted,
								},
							]}
							eventsData={[
								{
									id: '0',
									name: 'test-event',
									eventType: 'TEST',
								},
							]}
						/>
					</MockedProvider>
				</MemoryRouter>
			)
			.toJSON();

		expect(component).toMatchSnapshot();
	});
});
