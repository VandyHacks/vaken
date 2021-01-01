import React, { ButtonHTMLAttributes } from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { FloatingButton as Component } from './FloatingButton';

export default {
	title: 'Components/Buttons/Floating Button',
	component: Component,
	argTypes: { onClick: { action: 'onClick' } },
	args: { children: ['Button'] },
} as Meta;

export const FloatingButton: Story<ButtonHTMLAttributes<HTMLButtonElement>> = args => (
	<Component {...args} />
);
