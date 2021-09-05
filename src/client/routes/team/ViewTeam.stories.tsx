import React from 'react';
import { Meta, Story } from '@storybook/react';
import { ViewTeam, Props } from './ViewTeam';

export default {
	title: 'Routes/Team/View',
	component: ViewTeam,
} as Meta;

export const View: Story<Props> = args => <ViewTeam {...args} />;
View.args = {
	teamName: 'The VandyHacks Team',
};
