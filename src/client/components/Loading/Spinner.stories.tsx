import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component, { StyleProps as Props } from './Spinner';

export default {
	title: 'Components/Loading/Spinner',
	component: Component,
	argTypes: { color: { control: 'color' } },
} as Meta;

export const Spinner: Story<Props> = args => <Component {...args} />;
