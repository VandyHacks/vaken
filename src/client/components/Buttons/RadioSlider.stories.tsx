import React from 'react';
import { Meta, Story } from '@storybook/react';
import { RadioSlider as Component, Props } from './RadioSlider';

export default {
	title: 'Components/Buttons/Radio Slider',
	component: Component,
	parameters: { backgrounds: { default: 'dark' } },
	argTypes: {
		onChange: { action: 'onChange' },
	},
	args: {
		disable: false,
		option1: 'option1',
		option2: 'option2',
		option3: 'option3',
		value: 'option2',
	},
} as Meta;

export const RadioSlider: Story<Props> = args => <Component {...args} />;
