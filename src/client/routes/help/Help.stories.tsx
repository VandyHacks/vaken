import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component from './Help';

export default {
	title: 'Routes/Help',
	component: Component,
} as Meta;

export const Help: Story<Record<string, unknown>> = args => <Component {...args} />;
