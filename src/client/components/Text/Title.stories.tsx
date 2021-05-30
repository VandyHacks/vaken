import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component, { Props } from './Title';

export default {
	title: 'Components/Text/Title',
	component: Component,
} as Meta;

export const Title: Story<Props> = args => <Component {...args} />;
Title.args = {
	children: 'Title Text',
};
