import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { useImmer } from 'use-immer';
import { defaultTableState, TableContext } from '../../contexts/TableContext';
import Component, { Props } from './NfcTable';
import { MOCK_CHECK_IN_EVENT, MOCK_HACKERS } from '../../../common/mockObjects';

export default {
	title: 'Routes/NFC/NFC',
	component: Component,
} as Meta;

// TableContext works better inside the story than as a story decorator because
// the latter method forcibly re-renders the entire story when changed.
const NfcTable: Story<Props> = args => {
	const [tableState, setTableState] = useImmer(defaultTableState);
	return (
		<TableContext.Provider value={{ state: tableState, update: setTableState }}>
			<Component {...args} />
		</TableContext.Provider>
	);
};

export const TableWithFakeData: Story<Props> = args => <NfcTable {...args} />;
TableWithFakeData.args = {
	eventsData: [MOCK_CHECK_IN_EVENT],
	hackersData: MOCK_HACKERS,
};
