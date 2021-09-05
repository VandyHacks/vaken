import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ComponentProps as Props, Status as Component } from './Status';
import { ApplicationStatus } from '../../generated/graphql';

export default {
	title: 'Components/Text/Status',
	component: Component,
} as Meta;

export const Status: Story<Props> = args => <Component {...args} />;
Status.args = { generateColor: () => 'rebeccapurple', value: ApplicationStatus.Accepted };
