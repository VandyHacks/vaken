import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component, { Props } from './AutoCompleteTextInput';

export default {
	title: 'Components/Input/Auto Complete Text Input',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
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
		background: 'white',
	},
} as Meta;

export const AutoCompleteTextInput: Story<Props> = args => <Component {...args} />;
