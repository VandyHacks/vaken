import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './OAuthLogin';

export default {
	title: 'Routes/Login/Oauth Login Component',
	parameters: { backgrounds: { default: 'dark' } },
	component: Component,
} as Meta;

export const OauthLoginComponent: Story<Record<string, unknown>> = args => <Component {...args} />;
