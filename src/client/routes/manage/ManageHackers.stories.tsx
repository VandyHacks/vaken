import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MemoryRouter } from 'react-router-dom';
import Component from './ManageHackers';

export default {
	title: 'Routes/ManageHackers/Manage Hackers',
	component: Component,
} as Meta;

export const ManageHackers: Story<Record<string, unknown>> = args => (
	<MemoryRouter>
		<Component {...args} />
	</MemoryRouter>
);
