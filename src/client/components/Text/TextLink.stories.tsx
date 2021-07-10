import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component, { Props } from './TextLink';

export default {
	title: 'Components/Text/Text Link',
	component: Component,
} as Meta;

export const TextLink: Story<Props> = args => <Component {...args} />;
TextLink.args = {
	children: 'Text which is also a react-router link component',
	to: 'Link destination',
};
