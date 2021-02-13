import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import Component from './FileInput';
import { InputProps as Props } from './TextInput';
import { SignedReadUrlDocument, SignedReadUrlQueryResult } from '../../generated/graphql';

export default {
	title: 'Components/Input/File Input',
	component: Component,
} as Meta;

const mocks = [
	{
		request: {
			query: SignedReadUrlDocument,
			variables: { input: 'userid123' },
		},
		result: {
			data: {
				signedReadUrl: 'https://github.com/VandyHacks/vaken',
			},
		} as SignedReadUrlQueryResult,
	},
] as MockedResponse[];

export const FileInput: Story<Props> = args => (
	<MockedProvider>
		<Component {...args} />
	</MockedProvider>
);

export const FileInputWithExistingUpload: Story<Props> = args => (
	<MockedProvider mocks={mocks}>
		<Component {...args} />
	</MockedProvider>
);
FileInputWithExistingUpload.args = { value: 'userid123' };
