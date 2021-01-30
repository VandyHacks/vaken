import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { ThemeProvider } from 'styled-components';
import Component from './OrganizerDash';
import { theme } from '../../app';

export default {
	title: 'Routes/Dashboard/Organizer Dash',
	component: Component,
} as Meta;

export const OrganizerDash: Story<Record<string, unknown>> = args => (
	<ThemeProvider theme={theme}>
		<Component {...args} />
	</ThemeProvider>
);
