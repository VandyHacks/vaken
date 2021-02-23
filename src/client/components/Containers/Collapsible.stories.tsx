import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component, { Props } from './Collapsible';

export default {
	title: 'Components/Containers/Collapsible',
	component: Component,
	argTypes: { onClick: { action: 'onClick' } },
	args: {
		title: 'Title',
		children: 'Content',
	},
} as Meta;

export const Collapsible: Story<Props> = args => <Component {...args} />;
