import React from 'react';
import { Meta, Story } from '@storybook/react';
import { HackerViewProps, HackerView } from './HackerView';
import { MOCK_HACKER } from '../../../common/mockObjects';

export default {
	title: 'Routes/Manage/Hacker Table/Hacker View',
	component: HackerView,
} as Meta;

export const WithFakeData: Story<HackerViewProps> = args => <HackerView {...args} />;
WithFakeData.args = {
	match: { params: { id: MOCK_HACKER.id } },
} as Partial<HackerViewProps>;
