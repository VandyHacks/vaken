import React from 'react';

import {
	Column,
	SortIndicator,
	Table,
	TableHeaderProps,
	Index,
	RowMouseEventHandlerParams,
} from 'react-virtualized';
import styled from 'styled-components';

import { Row } from './Row';
import { SortFnProps } from './NfcTableTypes';

import STRINGS from '../../assets/strings.json';
import { TableCtxI } from '../../contexts/TableContext';

// Removes unwanted highlighting, adds alternating row colors
const StyledTable = styled(Table)`
	.ReactVirtualized__Table__Grid {
		:focus {
			outline: none;
			border: none;
		}

		overflow: hidden;
	}

	.ReactVirtualized__Table__row:focus {
		outline: none;
	}

	.headerRow {
		font-size: 1rem;
		text-transform: capitalize;
		color: ${STRINGS.DARK_TEXT_COLOR};
	}

	.headerRow,
	.evenRow,
	.oddRow {
		box-sizing: border-box;
		border-bottom: 0.0625rem solid #e0e0e0;
	}
	.oddRow {
		background-color: #fafafa;
	}

	.ReactVirtualized__Table__headerColumn {
		:focus {
			outline: none;
		}
	}

	font-size: 0.8rem;
	margin-bottom: 5rem;
	color: ${STRINGS.DARKEST_TEXT_COLOR};

	.selected {
		background-color: #e5e7fa;
	}
`;

// renders a text label with a clickable sort indicator
const renderHeaderAsLabel = ({
	dataKey,
	sortBy,
	sortDirection,
	label,
}: TableHeaderProps): JSX.Element => {
	return (
		<>
			{label}
			{sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
		</>
	);
};

interface NfcTableRowsProps {
	generateRowClassName: Function;
	height: number;
	onSortColumnChange: (ctx: TableCtxI) => (p: SortFnProps) => void;
	sortedData: unknown[];
	table: TableCtxI;
	width: number;
	rowClickFn: (p: RowMouseEventHandlerParams) => void;
}

export const NfcTableRows = ({
	width,
	height,
	sortedData,
	onSortColumnChange,
	generateRowClassName,
	table,
	rowClickFn,
}: NfcTableRowsProps): JSX.Element => (
	<StyledTable
		width={width}
		height={height}
		headerHeight={40}
		rowHeight={30}
		rowCount={sortedData.length}
		rowClassName={generateRowClassName}
		rowGetter={({ index }: Index) => sortedData[index]}
		rowRenderer={Row}
		onRowClick={rowClickFn}
		headerClassName="ignore-select"
		sort={onSortColumnChange(table)}
		{...table.state}>
		<Column
			className="column"
			label="First Name"
			dataKey="firstName"
			width={100}
			headerRenderer={renderHeaderAsLabel}
		/>
		<Column
			className="column"
			label="Last Name"
			dataKey="lastName"
			width={100}
			headerRenderer={renderHeaderAsLabel}
		/>
		<Column
			className="column"
			label="Email"
			dataKey="email"
			width={200}
			headerRenderer={renderHeaderAsLabel}
		/>
		<Column
			className="column"
			label="School"
			dataKey="school"
			width={175}
			headerRenderer={renderHeaderAsLabel}
		/>
	</StyledTable>
);

export default {
	NfcTableRows,
};
