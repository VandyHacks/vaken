import React, { FunctionComponent, useState } from 'react';
import {
	Table,
	Column,
	AutoSizer,
	SortDirection,
	SortIndicator,
	TableHeaderProps,
	SortDirectionType,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import Fuse from 'fuse.js';

const StyledTable = styled(Table)`
	.ReactVirtualized__Table__Grid {
		:focus {
			outline: none;
			border: none;
		}

		overflow: hidden;
	}

	.headerRow,
	.evenRow,
	.oddRow {
		box-sizing: border-box;
		border-bottom: 1px solid #e0e0e0;
	}
	.oddRow {
		background-color: #fafafa;
	}
`;

const TableLayout = styled('div')`
	height: 100%;
	width: 100%;
`;

enum HackerStatus {
	verified,
	started,
	submitted,
	accepted,
	confirmed,
	rejected,
}

interface Hacker {
	name: string;
	email: string;
	gradYear?: number;
	school?: string;
	status: HackerStatus;
	requiresTravelReimbursement?: boolean;
}

interface Props {
	data: Hacker[];
}

export const HackerTable: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const [sortBy, setSortBy] = useState('name');
	const [sortDirection, setSortDirection] = useState<SortDirectionType>(SortDirection.ASC);
	const [filteredData, setFilteredData] = useState<Hacker[]>(props.data);
	const sortData = ({
		sortBy,
		sortDirection,
	}: {
		sortBy: string;
		sortDirection: SortDirectionType;
	}) => {
		// const { data } = props;

		// sort alphanumerically
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

		// TODO: replace any
		let newSortedData = (filteredData as any).sort((a: any, b: any) =>
			collator.compare(a[sortBy], b[sortBy])
		);
		if (sortDirection === SortDirection.DESC) {
			newSortedData = newSortedData.reverse();
		}

		return newSortedData;
	};
	const [sortedData, setSortedData] = useState<Hacker[]>(sortData({ sortBy, sortDirection }));
	const [searchValue, setSearchValue] = useState('');
	const opts = {
		caseSensitive: true,
		shouldSort: true,
		tokenize: true,
		keys: ['name', 'email', 'school'] as (keyof Hacker)[],
	};

	const generateRowClassName = ({ index }: { index: number }): string =>
		index < 0 ? 'headerRow' : index % 2 === 0 ? 'evenRow' : 'oddRow';

	const renderHeader = ({
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

	const sort = ({
		sortBy,
		sortDirection,
	}: {
		sortBy: string;
		sortDirection: SortDirectionType;
	}) => {
		const sortedData = sortData({ sortBy, sortDirection });

		setSortBy(sortBy);
		setSortDirection(sortDirection);
		setSortedData(sortedData);
	};
	const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (value !== '') {
			// fuzzy filtering
			const fuse = new Fuse(props.data, opts);
			setFilteredData(fuse.search(value));
			sort({ sortBy, sortDirection });
		}
		setSearchValue(event.target.value);
	};

	return (
		<TableLayout>
			<input value={searchValue} onChange={onSearch} />
			<AutoSizer>
				{({ height, width }) => {
					console.log('height: ', height);
					console.log('width: ', width);
					return (
						<StyledTable
							width={width}
							height={height}
							headerHeight={20}
							rowHeight={30}
							rowCount={sortedData.length}
							rowClassName={generateRowClassName}
							rowGetter={({ index }: { index: number }) => sortedData[index]}
							sortBy={sortBy}
							sortDirection={sortDirection}
							sort={sort}>
							<Column
								className={'column'}
								label="Name"
								dataKey="name"
								width={150}
								headerRenderer={renderHeader}
							/>
							<Column
								className={'column'}
								label="Email"
								dataKey="email"
								width={200}
								headerRenderer={renderHeader}
							/>
							<Column
								className={'column'}
								label="Grad Year"
								dataKey="gradYear"
								width={100}
								headerRenderer={renderHeader}
							/>
							<Column
								className={'column'}
								label="School"
								dataKey="school"
								width={200}
								headerRenderer={renderHeader}
							/>
							<Column
								className={'column'}
								label="Status"
								dataKey="status"
								width={100}
								headerRenderer={renderHeader}
							/>
							<Column
								className={'column'}
								label="Requires Travel Reimbursement?"
								dataKey="requiresTravelReimbursement"
								width={275}
							/>
						</StyledTable>
					);
				}}
			</AutoSizer>
		</TableLayout>
	);
};

export default HackerTable;
