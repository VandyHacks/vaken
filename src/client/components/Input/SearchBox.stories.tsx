import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component, { Props } from './SearchBox';

export default {
	title: 'Components/Input/Search Box',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	argTypes: {
		value: { type: 'string', defaultValue: 'search value' },
		onChange: { action: 'onChange' },
	},
	args: {} as Props,
} as Meta;

export const SearchBox: Story<Props> = args => <Component {...args} />;
