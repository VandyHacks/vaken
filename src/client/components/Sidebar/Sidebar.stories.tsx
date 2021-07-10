import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component, { Props } from './Sidebar';

export default {
	title: 'Components/Sidebar/Sidebar',
	component: Component,
} as Meta;

export const Sidebar: Story<Props> = args => <Component {...args} />;
