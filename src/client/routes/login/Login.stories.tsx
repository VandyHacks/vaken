import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import Component from './Login';
import { theme } from '../../app';

export default {
	title: 'Routes/Login/Login Page',
	component: Component,
} as Meta;

export const LoginPage: Story<Record<string, unknown>> = args => (
	<ThemeProvider theme={theme}>
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</ThemeProvider>
);
