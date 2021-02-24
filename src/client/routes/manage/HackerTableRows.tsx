import React, { FC, useMemo } from 'react';

import {
	Column,
	SortIndicator,
	Table,
	TableHeaderProps,
	TableCellProps,
	TableRowProps,
	Index,
} from 'react-virtualized';
import styled from 'styled-components';
import { Status } from '../../components/Text/Status';
import { Checkmark } from '../../components/Symbol/Checkmark';

import { Row } from './Row';
import {
	ActionRendererProps,
	createActionRenderer,
	HackerStatusMutationFn,
} from './ActionRenderer';
import { reimbursementHeaderRenderer } from './ReimbursementHeader';
import { ResumeLink } from './ResumeLink';

import { ApplicationStatus } from '../../generated/graphql';
import STRINGS from '../../assets/strings.json';
import { QueriedHacker, SortFnProps } from './HackerTableTypes';
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

// renders a solid checkmark if true, else an empty circle
const checkmarkRenderer = ({ cellData }: TableCellProps): JSX.Element => {
	return <Checkmark value={cellData} />;
};

// wrapper to use createSelectable() from react-selectable-fast
const rowRenderer = (
	props: TableRowProps & { selectableRef: string; selected: boolean; selecting: boolean }
): JSX.Element => {
	return <Row {...props} />;
};

// mapping from status labels to the colored label images
const statusRenderer = ({ cellData }: TableCellProps): JSX.Element => {
	const generateColor = (value: ApplicationStatus): string => {
		switch (value) {
			case ApplicationStatus.Created:
				return STRINGS.COLOR_PALETTE[0];
			case ApplicationStatus.Started:
				return STRINGS.COLOR_PALETTE[2];
			case ApplicationStatus.Submitted:
				return STRINGS.COLOR_PALETTE[3];
			case ApplicationStatus.Accepted:
				return STRINGS.COLOR_PALETTE[4];
			case ApplicationStatus.Confirmed:
				return STRINGS.COLOR_PALETTE[5];
			case ApplicationStatus.Rejected:
				return STRINGS.COLOR_PALETTE[6];
			default:
				return STRINGS.ACCENT_COLOR_DARK;
		}
	};
	return <Status value={cellData} generateColor={generateColor} fontColor="black" />;
};

const ResumeRenderer: FC<ActionRendererProps> = ({ rowData: { id } }) => <ResumeLink id={id} />;

export interface HackerTableRowsProps {
	generateRowClassName: (arg: { index: number }) => string;
	height: number;
	onSortColumnChange: (ctx: TableCtxI) => (p: SortFnProps) => void;
	sortedData: QueriedHacker[];
	table: TableCtxI;
	updateStatus: HackerStatusMutationFn;
	width: number;
	isSponsor: boolean;
	viewResumes: boolean;
}

export const HackerTableRows = ({
	width,
	height,
	updateStatus,
	sortedData,
	onSortColumnChange,
	generateRowClassName,
	table,
	isSponsor = false,
	viewResumes = false,
}: HackerTableRowsProps): JSX.Element => {
	const ActionRenderer = useMemo(
		() => createActionRenderer(async input => void (await updateStatus({ variables: { input } }))),
		[updateStatus]
	);
	return (
		<StyledTable
			width={width}
			height={height}
			headerHeight={40}
			rowHeight={30}
			rowCount={sortedData.length}
			rowClassName={generateRowClassName}
			rowGetter={({ index }: Index) => sortedData[index]}
			rowRenderer={rowRenderer}
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
				label="Grad Year"
				dataKey="gradYear"
				width={100}
				headerRenderer={renderHeaderAsLabel}
			/>
			<Column
				className="column"
				label="School"
				dataKey="school"
				width={175}
				headerRenderer={renderHeaderAsLabel}
			/>
			{!isSponsor && (
				<Column
					className="column"
					label="Status"
					dataKey="status"
					width={100}
					minWidth={90}
					headerRenderer={renderHeaderAsLabel}
					cellRenderer={statusRenderer}
				/>
			)}
			{!isSponsor && (
				<Column
					className="column"
					label="Requires Travel Reimbursement?"
					dataKey="needsReimbursement"
					width={30}
					minWidth={20}
					headerRenderer={reimbursementHeaderRenderer}
					cellRenderer={checkmarkRenderer}
				/>
			)}
			{!isSponsor && (
				<Column
					className="column"
					label="Actions"
					dataKey="actions"
					width={275}
					minWidth={275}
					headerRenderer={renderHeaderAsLabel}
					cellRenderer={ActionRenderer}
				/>
			)}
			{isSponsor && viewResumes && (
				<Column
					className="column"
					label="Resume"
					dataKey="resume"
					width={275}
					minWidth={275}
					headerRenderer={renderHeaderAsLabel}
					cellRenderer={ResumeRenderer}
				/>
			)}
		</StyledTable>
	);
};

export default HackerTableRows;
