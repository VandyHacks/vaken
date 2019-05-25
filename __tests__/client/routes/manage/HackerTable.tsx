import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import HackerTable from '../../../../src/client/routes/manage/HackerTable';
import { HackerStatus } from '../../../../src/client/contexts/TableContext';

// NOTE: mock() must be called OUTSIDE the describe() methods b/c hoisted to top of scope
// see https://github.com/facebook/jest/issues/2582
jest.mock('react-selectable-fast', () => ({
	SelectableGroup: () => 'SelectableGroup',
}));
jest.mock('../../../../src/client/routes/manage/Row', () => () => 'Row');

describe('Test HackerTable', () => {
	it('renders correctly', async () => {
		// jest.mock('react-virtualized/dist/commonjs/AutoSizer', () => ({
		// 	render: () => <div />,
		// }));
		const component = renderer
			.create(
				<MemoryRouter>
					<HackerTable
						data={[
							{
								email: 'fakeemail@gmail.com',
								firstName: 'a',
								lastName: 'a',
								status: HackerStatus.Accepted,
							},
						]}
					/>
				</MemoryRouter>
			)
			.toJSON();

		expect(component).toMatchSnapshot();
	});
});
