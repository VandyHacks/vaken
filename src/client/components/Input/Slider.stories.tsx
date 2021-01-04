import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component, {
	SliderSansTitleCase as ComponentSansTitleCase,
	ShirtSlider as ShirtComponent,
	Props,
} from './Slider';
import { GlobalStyle } from '../../app';
import { ShirtSize } from '../../generated/graphql';

export default {
	title: 'Components/Input/Slider',
	component: Component,
	args: {
		options: ['alpha', 'beta', 'gamma', 'delta'],
		value: 'beta',
	},
} as Meta;

export const Slider: Story<Props> = args => (
	<>
		<GlobalStyle />
		<Component {...args} />
	</>
);
export const SliderSansTitleCase: Story<Props> = args => (
	<>
		<GlobalStyle />
		<ComponentSansTitleCase {...args} />
	</>
);
export const ShirtSlider: Story<Props> = args => (
	<>
		<GlobalStyle />
		<ShirtComponent {...args} />
	</>
);
ShirtSlider.args = { options: [ShirtSize.Xs, ShirtSize.WomensM], value: 'XS' };
