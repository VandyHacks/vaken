import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import Login from './Login';
import { theme } from '../../app';

it('Login renders properly', async () => {
	const component = renderer
		.create(
			<MemoryRouter>
				<ThemeProvider theme={theme}>
					<Login />
				</ThemeProvider>
			</MemoryRouter>
		)
		.toJSON();

	expect(component).toMatchSnapshot();
});
