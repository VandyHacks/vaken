import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component, { CheckboxSansTitleCase as ComponentSansTitleCase } from './Checkbox';
import { InputProps as Props } from './TextInput';
import { GlobalStyle } from '../../app';

export default {
	title: 'Components/Input/Checkbox',
	component: Component,
	args: {
		options: [
			'alpha',
			'beta',
			'gamma',
			'delta',
			'epsilon',
			'zeta',
			'eta',
			'theta',
			'iota',
			'kappa',
			'lambda',
			'mu',
			'nu',
		],
		value: 'alpha|beta|gamma',
	},
} as Meta;

export const Checkbox: Story<Props> = args => (
	<>
		<GlobalStyle />
		<Component {...args} />
	</>
);
export const CheckboxSansTitleCase: Story<Props> = args => (
	<>
		<GlobalStyle />
		<ComponentSansTitleCase {...args} />
	</>
);
