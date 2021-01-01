import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './TextButton';
import { ButtonProps } from './Buttons';

export default {
	title: 'Components/Buttons/Text Button',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	argTypes: {
		color: { control: 'color' },
		background: { control: 'color' },
		glowColor: { control: 'color' },
		onClick: { action: 'onClick' },
	},
	args: {
		children: ['Text Button'],
	},
} as Meta;

export const TextButton: Story<ButtonProps> = args => <Component {...args} />;
