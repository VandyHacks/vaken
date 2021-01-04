import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component, { Props } from './AutoCompleteTextInput';
import { GlobalStyle } from '../../app';

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

export const AutoCompleteTextInput: Story<Props> = args => (
	<>
		<GlobalStyle />
		<Component {...args} />
	</>
);
