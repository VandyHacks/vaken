import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component, { Props } from './TextArea';
import { GlobalStyle } from '../../app';

export default {
	title: 'Components/Input/Text Area',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	args: {
		value: 'Input Value',
	},
} as Meta;

export const TextArea: Story<Props> = args => (
	<>
		{/* font is from the global stylesheet. */}
		<GlobalStyle />
		<Component {...args} />
	</>
);
