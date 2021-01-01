import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component, { ImgButtonProps } from './LeftImgButton';

export default {
	title: 'Components/Buttons/Left Img Button',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	argTypes: { onClick: { action: 'onClick' } },
	args: {
		img: 'https://raw.githubusercontent.com/simple-icons/simple-icons/master/icons/github.svg',
		children: ['Left Img Button'],
	},
} as Meta;

export const LeftImgButton: Story<ImgButtonProps> = args => <Component {...args} />;
