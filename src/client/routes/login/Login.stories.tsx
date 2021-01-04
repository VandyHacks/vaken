import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MemoryRouter } from 'react-router-dom';
import Component from './Login';

export default {
	title: 'Routes/Login/Login Page',
	component: Component,
} as Meta;

export const LoginPage: Story<Record<string, unknown>> = args => (
	<MemoryRouter>
		<Component {...args} />
	</MemoryRouter>
);
