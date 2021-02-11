import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { createActionRenderer, ActionRendererProps } from './ActionRenderer';
import { theme } from '../../app';
import { ApplicationStatus } from '../../generated/graphql';

const Component = createActionRenderer(async () => void 0);

export default {
	title: 'Routes/Manage/Hacker Table/Action Renderer',
	component: Component,
} as Meta;

const Template: Story<ActionRendererProps> = args => (
	<ThemeProvider theme={theme}>
		<MemoryRouter>
			<Component {...args} />
		</MemoryRouter>
	</ThemeProvider>
);

export const Accepted: Story<ActionRendererProps> = args => <Template {...args} />;
Accepted.args = {
	rowData: { id: '1', status: ApplicationStatus.Accepted },
};

export const Rejected: Story<ActionRendererProps> = args => <Template {...args} />;
Rejected.args = {
	rowData: { id: '1', status: ApplicationStatus.Rejected },
};

export const Submitted: Story<ActionRendererProps> = args => <Template {...args} />;
Submitted.args = {
	rowData: { id: '1', status: ApplicationStatus.Submitted },
};

export const Created: Story<ActionRendererProps> = args => <Template {...args} />;
Created.args = {
	rowData: { id: '1', status: ApplicationStatus.Created },
};

export const Confirmed: Story<ActionRendererProps> = args => <Template {...args} />;
Confirmed.args = {
	rowData: { id: '1', status: ApplicationStatus.Confirmed },
};

export const Declined: Story<ActionRendererProps> = args => <Template {...args} />;
Declined.args = {
	rowData: { id: '1', status: ApplicationStatus.Declined },
};

export const Started: Story<ActionRendererProps> = args => <Template {...args} />;
Started.args = {
	rowData: { id: '1', status: ApplicationStatus.Started },
};
