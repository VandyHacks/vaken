import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from 'react-apollo/test-utils';
import HackerTable from './HackerTable';
import { ApplicationStatus } from '../../generated/graphql';

// NOTE: mock() must be called OUTSIDE the describe() methods b/c hoisted to top of scope
// see https://github.com/facebook/jest/issues/2582
jest.mock('react-selectable-fast', () => ({
	SelectableGroup: () => 'SelectableGroup',
}));
jest.mock('./Row', () => () => 'Row');

test.skip('Test HackerTable', () => {
	it('renders correctly', async () => {
		// jest.mock('react-virtualized/dist/commonjs/AutoSizer', () => ({
		// 	render: () => <div />,
		// }));
		const component = renderer
			.create(
				<MemoryRouter>
					<MockedProvider mocks={[]}>
						<HackerTable
							data={[
								{
									email: 'fakeemail@gmail.com',
									firstName: 'a',
									id: 'foo',
									lastName: 'a',
									status: ApplicationStatus.Accepted,
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
