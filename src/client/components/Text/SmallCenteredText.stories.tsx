import React from 'react';
import { Meta, Story } from '@storybook/react';
import { SmallCenteredText as Component, Props } from './SmallCenteredText';

export default {
	title: 'Components/Text/Small Centered Text',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
} as Meta;

export const SmallCenteredText: Story<Props> = args => <Component {...args} />;
SmallCenteredText.args = { children: 'This is small, centered text.' };
