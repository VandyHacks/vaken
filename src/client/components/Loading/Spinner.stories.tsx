import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MemoryRouter } from 'react-router-dom';
import Component, { StyleProps as Props } from './Spinner';

export default {
	title: 'Components/Loading/Spinner',
	component: Component,
	argTypes: { color: { control: 'color' } },
} as Meta;

export const Spinner: Story<Props> = args => (
	<MemoryRouter>
		<Component {...args} />
	</MemoryRouter>
);
