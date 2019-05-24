import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import Dashboard from '../../../../src/client/routes/dashboard/Dashboard';

describe('Test Dashboard', () => {
	it('renders hackerdash on /dashboard route', async () => {
		// jest.mock('react-virtualized/dist/commonjs/AutoSizer', () => ({
		// 	render: () => <div />,
		// }));
		const component = renderer
			.create(
				<MemoryRouter initialEntries={['/dashboard']}>
					<Dashboard />
				</MemoryRouter>
			)
			.toJSON();

		expect(component).toMatchSnapshot();
	});
});
