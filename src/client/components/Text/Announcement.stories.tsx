import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { Announcement as Component, Props } from './Announcement';

export default {
	title: 'Components/Text/Announcement',
	component: Component,
	args: {
		value: 'This is an announcement',
	},
} as Meta;

export const Announcement: Story<Props> = args => <Component {...args} />;
