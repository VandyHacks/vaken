import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './CheckInEvents';

export default {
	title: 'Routes/Events/Check In Events',
	component: Component,
} as Meta;

export const CheckInEvents: Story = args => <Component {...args} />;
