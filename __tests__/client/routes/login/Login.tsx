import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import Login from '../../../../src/client/routes/login/Login';

it('Login renders properly', async () => {
	const component = renderer
		.create(
			<MemoryRouter>
				<Login />
			</MemoryRouter>
		)
		.toJSON();

	expect(component).toMatchSnapshot();
});
