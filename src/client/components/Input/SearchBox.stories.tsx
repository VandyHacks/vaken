import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component, { Props } from './SearchBox';
import { GlobalStyle } from '../../app';

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

export const SearchBox: Story<Props> = args => (
	<>
		{/* Button sizing and font is from the global stylesheet. */}
		<GlobalStyle />
		<Component {...args} />
	</>
);
