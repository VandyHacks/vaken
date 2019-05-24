import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import TextLink from '../../../../src/client/components/Text/TextLink';
describe('Test TextLink', () => {
	it('renders correctly', async () => {
		const component = renderer
			.create(
				<MemoryRouter>
					<TextLink to="/" />
				</MemoryRouter>
			)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
