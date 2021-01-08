import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './OrganizerDash';

export default {
	title: 'Routes/Dashboard/Organizer Dash',
	component: Component,
} as Meta;

export const OrganizerDash: Story<Record<string, unknown>> = args => <Component {...args} />;
