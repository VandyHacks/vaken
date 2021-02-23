import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { createActionRenderer, ActionRendererProps } from './ActionRenderer';
import { ApplicationStatus } from '../../generated/graphql';

const ActionRenderer = createActionRenderer(async () => void 0);

export default {
	title: 'Routes/Manage/Hacker Table/Action Renderer',
	component: ActionRenderer,
} as Meta;

export const Accepted: Story<ActionRendererProps> = args => <ActionRenderer {...args} />;
Accepted.args = {
	rowData: { id: '1', status: ApplicationStatus.Accepted },
};

export const Rejected: Story<ActionRendererProps> = args => <ActionRenderer {...args} />;
Rejected.args = {
	rowData: { id: '1', status: ApplicationStatus.Rejected },
};

export const Submitted: Story<ActionRendererProps> = args => <ActionRenderer {...args} />;
Submitted.args = {
	rowData: { id: '1', status: ApplicationStatus.Submitted },
};

export const Created: Story<ActionRendererProps> = args => <ActionRenderer {...args} />;
Created.args = {
	rowData: { id: '1', status: ApplicationStatus.Created },
};

export const Confirmed: Story<ActionRendererProps> = args => <ActionRenderer {...args} />;
Confirmed.args = {
	rowData: { id: '1', status: ApplicationStatus.Confirmed },
};

export const Declined: Story<ActionRendererProps> = args => <ActionRenderer {...args} />;
Declined.args = {
	rowData: { id: '1', status: ApplicationStatus.Declined },
};

export const Started: Story<ActionRendererProps> = args => <ActionRenderer {...args} />;
Started.args = {
	rowData: { id: '1', status: ApplicationStatus.Started },
};
