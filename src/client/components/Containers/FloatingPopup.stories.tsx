import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './FloatingPopup';

export default {
	title: 'Components/Containers/Floating Popup',
	component: Component,
	argTypes: {
		backgroundOpacity: { control: 'range', min: 0, max: 1, step: 0.01 },
	},
	args: {
		backgroundOpacity: 1,
	},
} as Meta;

export const FloatingPopup: Story<Props> = args => <Component {...args} />;
