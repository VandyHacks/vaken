import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component, { Props } from './TextInput';
import { GlobalStyle } from '../../app';

export default {
	title: 'Components/Input/Text Input',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	args: {
		background: 'white',
		value: 'Input Value',
	},
} as Meta;

export const TextInput: Story<Props> = args => (
	<>
		{/* font is from the global stylesheet. */}
		<GlobalStyle />
		<Component {...args} />
	</>
);
