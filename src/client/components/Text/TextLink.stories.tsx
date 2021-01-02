import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MemoryRouter } from 'react-router-dom';
import Component, { Props } from './TextLink';

export default {
	title: 'Components/Text/Text Link',
	component: Component,
} as Meta;

export const TextLink: Story<Props> = args => (
	<MemoryRouter>
		<Component {...args} />
	</MemoryRouter>
);
TextLink.args = {
	children: 'Text which is also a react-router link component',
	to: 'Link destination',
};
