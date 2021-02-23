import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './ManageEvents';

export default {
	title: 'Routes/Events/Manage Events',
	component: Component,
} as Meta;

export const ManageEvents: Story = args => <Component {...args} />;
