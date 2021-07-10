import React from 'react';
import { Meta, Story } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';
import { SponsorHackerView as Component } from './SponsorHackerView';
import { MOCK_HACKER } from '../../../common/mockObjects';

export default {
	title: 'Routes/Manage/Hacker Table/Sponsor Hacker View',
	component: Component,
} as Meta;

export const SponsorHackerView: Story = args => <Component {...args} />;
SponsorHackerView.decorators = [
	StoryFunc => (
		<MemoryRouter initialEntries={['/view/hackers']}>
			<StoryFunc />
		</MemoryRouter>
	),
];

export const SponsorHackerDetailView: Story = args => <Component {...args} />;
SponsorHackerDetailView.decorators = [
	StoryFunc => (
		<MemoryRouter initialEntries={[`/view/hackers/detail/${MOCK_HACKER.id}`]}>
			<StoryFunc />
		</MemoryRouter>
	),
];
