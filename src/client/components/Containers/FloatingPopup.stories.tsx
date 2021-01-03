import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MemoryRouter } from 'react-router-dom';
import Component, { Props } from './FloatingPopup';

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

export const FloatingPopup: Story<Props> = args => (
	<MemoryRouter>
		<Component {...args} />
	</MemoryRouter>
);
