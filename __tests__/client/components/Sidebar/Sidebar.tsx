import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Sidebar from '../../../../src/client/components/Sidebar/Sidebar';

describe('Test Sidebar', () => {
	it('Sidebar renders correctly', async () => {
		const component = renderer
			.create(
				// see https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/testing.md
				<MemoryRouter>
					<Sidebar />
				</MemoryRouter>
			)
			.toJSON();

		expect(component).toMatchSnapshot();
	});
});
