import React from 'react';
import { Meta, Story } from '@storybook/react';
import Component from './Nfc';

export default {
	title: 'Routes/NFC',
	component: Component,
} as Meta;

export const Nfc: Story<Record<string, unknown>> = args => <Component {...args} />;
