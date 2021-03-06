import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import {
	ErrorMessage,
	ErrorMessageProps,
	GraphQLErrorMessage,
	GraphQLErrorMessageProps,
} from './ErrorMessage';

export default {
	title: 'Components/Text/Error Message',
	component: ErrorMessage,
} as Meta;

export const DefaultErrorMessage: Story<ErrorMessageProps> = args => <ErrorMessage {...args} />;
DefaultErrorMessage.args = { children: <p>This is an error message</p> };

export const DefaultGraphQLErrorMessage: Story<GraphQLErrorMessageProps> = args => (
	<GraphQLErrorMessage {...args} />
);
DefaultGraphQLErrorMessage.args = { text: 'This is an error message' };

export const GraphQLErrorMessageWithLongText: Story<GraphQLErrorMessageProps> = args => (
	<GraphQLErrorMessage {...args} />
);
GraphQLErrorMessageWithLongText.args = {
	text:
		"This is an error message with really really long text that just keeps going. You think that error messages could be concise and simple to understand because what happened? An Error. No ordinary user will be able to fix an error message, and a real dev would just open the dev tools, but no. Long messages are a must. What happens if it is autogenerated by Apollo? Need to have support for it. Object string dump? Gotta support it. Our entire database of PII? Let's at least make sure it's possible.",
};
