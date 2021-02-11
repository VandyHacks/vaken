import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './Calendar';
import { InputProps as Props } from './TextInput';
import { GlobalStyle } from '../../app';

export default {
	title: 'Components/Input/Calendar Input',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	args: {
		value: '1/1/2021',
	},
} as Meta;

export const CalendarInput: Story<Props> = args => (
	<>
		<GlobalStyle />
		<Component {...args} />
	</>
);
