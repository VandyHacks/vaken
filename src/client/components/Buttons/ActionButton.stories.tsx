import React, { ButtonHTMLAttributes } from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { ActionButton as Component } from './ActionButton';

export default {
	title: 'Components/Buttons/Action Button',
	component: Component,
	argTypes: { onClick: { action: 'onClick' } },
	args: { children: ['Save'] },
} as Meta;

export const ActionButton: Story<ButtonHTMLAttributes<HTMLButtonElement>> = args => (
	<Component {...args} />
);
