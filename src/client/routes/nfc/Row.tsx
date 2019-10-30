import React from 'react';
import { createSelectable } from 'react-selectable-fast';
import { TableRowRenderer, defaultTableRowRenderer } from 'react-virtualized';

export const Row: TableRowRenderer = (props): React.ReactNode => {
	const { rowData } = props;

	return defaultTableRowRenderer({
		...props,
		key: rowData.id,
	});
};

export default createSelectable(Row);
