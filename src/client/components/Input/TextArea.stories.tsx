import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component, { Props } from './TextArea';

export default {
	title: 'Components/Input/Text Area',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	args: {
		value: 'Input Value',
	},
} as Meta;

export const TextArea: Story<Props> = args => <Component {...args} />;
