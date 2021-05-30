import React from 'react';
import { Meta, Story } from '@storybook/react';
import { JoinTeam } from './JoinTeam';

export default {
	title: 'Routes/Team/Join',
	component: JoinTeam,
} as Meta;

export const Join: Story = args => <JoinTeam {...args} />;
