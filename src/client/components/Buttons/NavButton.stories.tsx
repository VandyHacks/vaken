import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component, { StyleProps } from './NavButton';

export default {
	title: 'Components/Buttons/Nav Button',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	argTypes: {
		color: { control: 'color' },
		active: { control: 'boolean' },
		onClick: { action: 'onClick' },
	},
	args: {
		color: 'white',
		active: false,
		children: ['Nav Button'],
	},
} as Meta;

export const NavButton: Story<StyleProps> = args => <Component {...args} />;
