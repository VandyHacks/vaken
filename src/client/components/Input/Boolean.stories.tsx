import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './Boolean';
import { InputProps as Props } from './TextInput';

export default {
	title: 'Components/Input/Boolean',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	args: { value: 'Yes' },
} as Meta;

export const Boolean: Story<Props> = args => <Component {...args} />;
