import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { useImmer } from 'use-immer';
import { defaultTableState, TableContext } from '../../contexts/TableContext';
import { MOCK_HACKERS } from '../../../common/mockObjects';
import Component, { HackerTableProps } from './HackerTable';

export default {
	title: 'Routes/Manage/Hacker Table/Hacker Table',
	component: Component,
} as Meta;

// TableContext works better inside the story than as a story decorator because
// the latter method forcibly re-renders the entire story when changed.
const HackerTable: Story<HackerTableProps> = args => {
	const [tableState, setTableState] = useImmer(defaultTableState);
	return (
		<TableContext.Provider value={{ state: tableState, update: setTableState }}>
			<Component {...args} />
		</TableContext.Provider>
	);
};

export const WithFakeData: Story<HackerTableProps> = args => <HackerTable {...args} />;
WithFakeData.args = {
	data: MOCK_HACKERS,
	isSponsor: false,
	viewResumes: true,
};

export const SponsorView: Story<HackerTableProps> = args => <HackerTable {...args} />;
SponsorView.args = {
	data: MOCK_HACKERS,
	isSponsor: true,
};

export const WithResumes: Story<HackerTableProps> = args => <HackerTable {...args} />;
WithResumes.args = {
	data: MOCK_HACKERS,
	viewResumes: true,
};
