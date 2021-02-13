import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { useImmer } from 'use-immer';
import { defaultTableState, TableContext } from '../../contexts/TableContext';
import Component from './Nfc';
import { MOCK_HACKERS } from '../../../common/mockObjects';

export default {
	title: 'Routes/NFC/NFC',
	component: Component,
} as Meta;

// TableContext works better inside the story than as a story decorator because
// the latter method forcibly re-renders the entire story when changed.
const Nfc: Story<Record<string, unknown>> = args => {
	const [tableState, setTableState] = useImmer(defaultTableState);
	return (
		<TableContext.Provider value={{ state: tableState, update: setTableState }}>
			<Component {...args} />
		</TableContext.Provider>
	);
};

export const WithFakeData: Story<Record<string, unknown>> = args => <Nfc {...args} />;
WithFakeData.args = {
	data: MOCK_HACKERS,
	isSponsor: false,
	viewResumes: true,
};
