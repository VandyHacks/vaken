import React from 'react';
import 'happo-plugin-storybook/register';
import { ThemeProvider } from 'styled-components';
import { theme, GlobalStyle } from '../src/client/app';
import { MemoryRouter } from 'react-router-dom';

export const parameters = {
	actions: { argTypesRegex: '^on[A-Z].*' },
};

export const decorators = [
	Story => (
		<ThemeProvider theme={theme}>
			<Story />
		</ThemeProvider>
	),
	Story => (
		<MemoryRouter>
			<Story />
		</MemoryRouter>
	),
	Story => (
		<>
			<GlobalStyle />
			<Story />
		</>
	),
];
