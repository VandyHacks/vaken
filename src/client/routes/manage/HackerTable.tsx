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
import searchIcon from '../../assets/img/search_icon.svg';
import { RightPaddedImg, ButtonOutline } from '../../components/Buttons/Buttons';
import STRINGS from '../../assets/strings.json';
import Select from 'react-select';

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

	font-size: 0.8rem;
	margin-bottom: 5rem;
	color: ${STRINGS.DARKEST_TEXT_COLOR};
`;

const TableLayout = styled('div')`
	width: 100%;
	box-sizing: border-box;
	flex: 1 0 auto;
	display: flex;
	flex-direction: column;
`;

const SearchBox = styled('input')`
	width: 25rem;
	margin: 0.25rem 1rem 0.25rem 0rem;
	padding: 0.75rem;
	border: 0.0625rem solid #ecebed;
	box-shadow: 0rem 0.5rem 4rem rgba(0, 0, 0, 0.07);
	border-radius: 0.375rem;
	font-size: 1rem;
	box-sizing: border-box;
	background: #ffffff url(${searchIcon}) 0.25rem 50% no-repeat;
	padding-left: 2rem;
	:focus, :active {
		outline: none;
		border: 0.0625rem solid ${STRINGS.ACCENT_COLOR};
	}
`;

const TableOptions = styled('div')`
	margin-bottom: 1rem;
`;

const TableData = styled('div')`
	flex: 1 1 auto;
`;

const ColumnSelect = styled(Select)`
	min-width: 10rem;
	display: inline-block;
	font-size: 1rem;
	margin-right: 1rem;
	box-shadow: none;
	.select__control, .basic-multi-select, select__control--menu-is-open {	
		background-color: #ffffff;
		padding: 0.20rem;
		border: 0.0625rem solid #ecebed;
		border-radius: 0.375rem;
		box-shadow: none;
		outline: none;
		:focus, :active {
			border: 0.0625rem solid ${STRINGS.ACCENT_COLOR};
		}
		:hover:not(.select__control--is-focused) {
			border: 0.0625rem solid #ecebed;
		}
		:hover.select__control--is-focused {
			border: 0.0625rem solid ${STRINGS.ACCENT_COLOR};
		}
	}
	.select__control--is-focused {
		border: 0.0625rem solid ${STRINGS.ACCENT_COLOR};
	}
	.select__multi-value__label {
		font-size: 1rem;
	}
	.select__option {
		:active, :hover, :focus {
			background-color: #E5E7FA;
		}
	}
	.select__option--is-focused {
		background-color: #E5E7FA;
	}
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
			if (!useRegex) {
				// fuzzy filtering
				const fuse = new Fuse(props.data, opts);
				setSortedData(fuse.search(value));
				console.log(fuse.search(value));
			} else {
				console.log("regex searching!");
			}
		} else {
			// reset
			setSortedData(props.data);
		}
		setSearchValue(event.target.value);
	};

	const columnOptions = [
		{ value: 'name', label: 'Name'},
		{ value: 'email', label: 'Email Address'},
		{ value: 'school', label: 'School'},
		{ value: 'gradYear', label: 'Graduation Year'},
		{ value: 'status', label: 'Status'},
	]

	return (
		<TableLayout>
			<TableOptions>
				<ColumnSelect
					isMulti
					name="colors"
					defaultValue={[columnOptions[0]]}
					options={columnOptions}
					className="basic-multi-select"
					classNamePrefix="select"
				/>
				<SearchBox
					value={searchValue}
					placeholder={useRegex ? 'Search by regex string, e.g. "^example"' : 'Search by text'}
					onChange={onSearch}/>
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
