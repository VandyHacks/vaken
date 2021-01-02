import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MemoryRouter } from 'react-router-dom';
import Component, { Props } from './Sidebar';
import { GlobalStyle } from '../../app';

export default {
	title: 'Components/Sidebar/Sidebar',
	component: Component,
} as Meta;

export const Sidebar: Story<Props> = args => (
	<MemoryRouter>
		{/* Proper rendering of ul elements relies on the global stylesheet */}
		<GlobalStyle />
		<Component {...args} />
	</MemoryRouter>
);
