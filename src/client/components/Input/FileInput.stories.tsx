import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import Component from './FileInput';
import { InputProps as Props } from './TextInput';

export default {
	title: 'Components/Input/File Input',
	component: Component,
} as Meta;

export const FileInput: Story<Props> = args => <Component {...args} />;

export const FileInputWithExistingUpload: Story<Props> = args => <Component {...args} />;
FileInputWithExistingUpload.args = { value: 'userid123' };
