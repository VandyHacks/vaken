import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Frame from './Frame';

describe('Test Frame', () => {
	it('Frame renders correctly', async () => {
		const component = renderer
			.create(
				<MemoryRouter>
					<Frame />
				</MemoryRouter>
			)
			.toJSON();

		expect(component).toMatchSnapshot();
	});
});
