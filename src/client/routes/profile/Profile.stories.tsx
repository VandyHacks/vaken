import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component from './Profile';

export default {
	title: 'Routes/Profile',
	component: Component,
} as Meta;

export const Profile: Story = args => <Component {...args} />;
