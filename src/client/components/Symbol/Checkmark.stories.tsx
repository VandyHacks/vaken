import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { Checkmark as Component, Props } from './Checkmark';

export default {
	title: 'Components/Symbol/Checkmark',
	component: Component,
	args: {
		value: true,
	},
} as Meta;

export const Checkmark: Story<Props> = args => <Component {...args} />;
