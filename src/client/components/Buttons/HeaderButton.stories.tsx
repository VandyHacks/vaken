import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { HeaderButton as Component, Props } from './HeaderButton';

export default {
	title: 'Components/Buttons/Header Button',
	component: Component,
	argTypes: { onClick: { action: 'onClick' } },
	args: { children: ['Button'] },
} as Meta;

export const HeaderButton: Story<Props> = args => <Component {...args} />;
