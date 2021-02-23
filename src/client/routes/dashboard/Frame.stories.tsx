import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './Frame';

export default {
	title: 'Routes/Dashboard/Frame',
	component: Component,
} as Meta;

export const Frame: Story<Record<string, unknown>> = args => <Component {...args} />;
