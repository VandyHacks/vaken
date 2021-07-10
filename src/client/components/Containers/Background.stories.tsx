import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component, { Props } from './Background';

export default {
	title: 'Components/Containers/Background',
	component: Component,
	args: {
		img:
			'https://images.unsplash.com/photo-1608385291103-a2880323105e?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2250&q=80',
	},
} as Meta;

export const Background: Story<Props> = args => <Component {...args} />;
