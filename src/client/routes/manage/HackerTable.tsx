import React, { FunctionComponent, useState, useEffect } from 'react';
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
import ToggleSwitch from '../../components/Buttons/ToggleSwitch';
import { displayFlex } from '../../components/Containers/FlexContainers';

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
	font-size: 0.8rem;
	margin-bottom: 5rem;
`;

const TableLayout = styled('div')`
	width: 100%;
	box-sizing: border-box;
	flex: 1 0 auto;
	display: flex;
	flex-direction: column;
`;

const SearchBox = styled('input')`
	width: 30rem;
	margin: 0.25rem 1rem 0.25rem 0.25rem;
	padding: 0.75rem;
	background: #ffffff;
	border: 1px solid #ecebed;
	box-shadow: 0px 7px 64px rgba(0, 0, 0, 0.07);
	border-radius: 6px;
	font-size: 1rem;
	box-sizing: border-box;
`;

const TableOptions = styled('div')`
	margin-bottom: 1rem;
`;

const TableData = styled('div')`
	flex: 1 1 auto;
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
	const [sortedData, setSortedData] = useState<Hacker[]>(props.data);
	const [searchValue, setSearchValue] = useState('');
	const [useRegex, setUseRegex] = useState(false);

	const sortData = ({
		sortBy,
		sortDirection,
	}: {
		sortBy: string;
		sortDirection: SortDirectionType;
	}) => {
		// sort alphanumerically
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

		// TODO: replace any
		let newSortedData = (sortedData as any).sort((a: any, b: any) =>
			collator.compare(a[sortBy], b[sortBy])
		);
		if (sortDirection === SortDirection.DESC) {
			newSortedData = newSortedData.reverse();
		}

		return newSortedData;
	};

	// only gets called once per prop.data
	useEffect(() => {
		setSortedData(sortData({ sortBy, sortDirection }));
	}, [props.data]);

	useEffect(() => {
		sort({ sortBy, sortDirection });
	}, [sortedData]);

	const opts = {
		caseSensitive: true,
		shouldSort: false,
		tokenize: true,
		threshold: 0.5,
		distance: 100,
		location: 0,
		findAllMatches: true,
		keys: ['name', 'school', 'gradYear'] as (keyof Hacker)[],
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
			setSortedData(fuse.search(value));
			console.log(fuse.search(value));
		} else {
			// reset
			setSortedData(props.data);
		}
		setSearchValue(event.target.value);
	};

	return (
		<TableLayout>
			<TableOptions>
				<SearchBox
					value={searchValue}
					placeholder={useRegex ? 'Search by regex string, e.g. "^example"' : 'Search by text'}
					onChange={onSearch}
				/>
				<ToggleSwitch
					label="Use Regex?"
					checked={useRegex}
					onChange={value => setUseRegex(value)}
				/>
			</TableOptions>
			<TableData>
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
									className="column"
									label="Name"
									dataKey="name"
									width={150}
									headerRenderer={renderHeader}
								/>
								<Column
									className="column"
									label="Email"
									dataKey="email"
									width={200}
									headerRenderer={renderHeader}
								/>
								<Column
									className="column"
									label="Grad Year"
									dataKey="gradYear"
									width={100}
									headerRenderer={renderHeader}
								/>
								<Column
									className="column"
									label="School"
									dataKey="school"
									width={200}
									headerRenderer={renderHeader}
								/>
								<Column
									className="column"
									label="Status"
									dataKey="status"
									width={100}
									headerRenderer={renderHeader}
								/>
								<Column
									className="column"
									label="Requires Travel Reimbursement?"
									dataKey="requiresTravelReimbursement"
									width={275}
								/>
							</StyledTable>
						);
					}}
				</AutoSizer>
			</TableData>
		</TableLayout>
	);
};

export default HackerTable;
