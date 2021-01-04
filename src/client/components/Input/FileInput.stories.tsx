import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import Component from './FileInput';
import { InputProps as Props } from './TextInput';
import { SignedReadUrlDocument, SignedReadUrlQueryResult } from '../../generated/graphql';
import { GlobalStyle } from '../../app';

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
		<>
			{/* Button sizing and font is from the global stylesheet. */}
			<GlobalStyle />
			<Component {...args} />
		</>
	</MockedProvider>
);

export const FileInputWithExistingUpload: Story<Props> = args => (
	<MockedProvider mocks={mocks}>
		<>
			{/* Button sizing, link styling, and font is from the global stylesheet. */}
			<GlobalStyle />
			<Component {...args} />
		</>
	</MockedProvider>
);
FileInputWithExistingUpload.args = { value: 'userid123' };
