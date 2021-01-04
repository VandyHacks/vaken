import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component, { Props } from './LeftImgTextInput';
import { GlobalStyle } from '../../app';
import logo from '../../assets/img/github_logo.svg';

export default {
	title: 'Components/Input/Left Img Text Input',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	args: {
		img: logo,
		imgAlt: 'GitHub logo',
		value: 'Input Value',
	},
} as Meta;

export const LeftImgTextInput: Story<Props> = args => (
	<>
		{/* Button sizing and font is from the global stylesheet. */}
		<GlobalStyle />
		<Component {...args} />
	</>
);
