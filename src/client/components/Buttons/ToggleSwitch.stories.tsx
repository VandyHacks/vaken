import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ToggleSwitch as Component, Props } from './ToggleSwitch';

export default {
	title: 'Components/Buttons/Toggle Switch',
	component: Component,
	// parameters: { backgrounds: { default: 'dark' } },
	argTypes: {
		onChange: { action: 'onChange' },
	},
	args: {
		checked: true,
		children: ['Text Button'],
	},
} as Meta;

export const ToggleSwitch: Story<Props> = args => <Component {...args} />;
