import React, { ButtonHTMLAttributes } from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { TableButton as Component } from './TableButton';

export default {
	title: 'Components/Buttons/Table Button',
	component: Component,
	argTypes: { onClick: { action: 'onClick' } },
	args: { children: ['Btn'] },
} as Meta;

export const TableButton: Story<ButtonHTMLAttributes<HTMLButtonElement>> = args => (
	<Component {...args} />
);
