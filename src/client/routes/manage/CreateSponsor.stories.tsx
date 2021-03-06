import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './CreateSponsor';

export default {
	title: 'Routes/Manage/Create Sponsor',
	component: Component,
} as Meta;

export const CreateSponsor: Story<Record<string, unknown>> = args => <Component {...args} />;
