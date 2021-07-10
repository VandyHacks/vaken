import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Button as Component, ButtonProps } from './Buttons';

export default {
	title: 'Components/Buttons/Button',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	argTypes: { onClick: { action: 'onClick' }, glowColor: { control: 'color' } },
	args: { children: ['Button'], invalid: false, enabled: true },
} as Meta;

export const Button: Story<ButtonProps> = args => <Component {...args} />;
