import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component from './Application';

export default {
	title: 'Routes/Application/Application',
	component: Component,
} as Meta;

export const Application: Story<Record<string, unknown>> = args => <Component {...args} />;
