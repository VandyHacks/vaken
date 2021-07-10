import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component from './Team';

export default {
	title: 'Routes/Team/Team',
	component: Component,
} as Meta;

export const Team: Story = args => <Component {...args} />;
