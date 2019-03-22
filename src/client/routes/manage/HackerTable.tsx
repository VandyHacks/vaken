import React, { FunctionComponent, useState, useEffect } from 'react';
import {
	Table,
	Column,
	AutoSizer,
	SortDirection,
	SortIndicator,
	TableHeaderProps,
	TableCellProps,
	TableRowProps,
	SortDirectionType,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import Fuse from 'fuse.js';
import TableButton from '../../components/Buttons/TableButton';
import ToggleSwitch from '../../components/Buttons/ToggleSwitch';
import RadioSlider from '../../components/Buttons/RadioSlider';
import Status from '../../components/Text/Status';
import Checkmark from '../../components/Symbol/Checkmark';
import searchIcon from '../../assets/img/search_icon.svg';
import plane from '../../assets/img/plane.svg';
import STRINGS from '../../assets/strings.json';
import Select from 'react-select';
// TODO(alan): add d.ts file
// @ts-ignore
import { SelectableGroup, createSelectable } from 'react-selectable-fast';
import Row from './Row';
// import { Hacker } from 'src/server/models/Hacker';

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
		background-color: #E5E7FA;
	}
`;

const TableLayout = styled('div')`
	width: 100%;
	box-sizing: border-box;
	flex: 1 0 auto;
	display: flex;
	flex-direction: column;
`;

const SearchBox = styled('input')`
	min-width: 30rem;
	margin: 0.25rem 1rem 0.25rem 0rem;
	padding: 0.75rem;
	border: 0.0625rem solid #ecebed;
	box-shadow: 0rem 0.5rem 4rem rgba(0, 0, 0, 0.07);
	border-radius: 0.375rem;
	font-size: 1rem;
	box-sizing: border-box;
	padding-left: 2rem;
	background: #ffffff url(${searchIcon}) 0.25rem 50% no-repeat;
	:focus,
	:active {
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
	min-width: 15rem;
	display: inline-block;
	font-size: 1rem;
	margin-right: 1rem;
	box-shadow: none;
	.select__control,
	.basic-multi-select,
	select__control--menu-is-open {
		background-color: #ffffff;
		padding: 0.2rem;
		border: 0.0625rem solid #ecebed;
		border-radius: 0.375rem;
		box-shadow: none;
		outline: none;
		:focus,
		:active {
			border: 0.0625rem solid ${STRINGS.ACCENT_COLOR};
		}
		:hover:not(.select__control--is-focused) {
			border: 0.0625rem solid #ecebed;
		}
		:hover.select__control--is-focused {
			border: 0.0625rem solid ${STRINGS.ACCENT_COLOR};
		}
	}
	.select__control--is-focused,
	.select__control--is-selected {
		border: 0.0625rem solid ${STRINGS.ACCENT_COLOR};
	}
	.select__multi-value__label {
		font-size: 1rem;
	}
	.select__option {
		:active,
		:hover,
		:focus {
			background-color: #e5e7fa;
		}
	}
	.select__option--is-focused,
	.select__option--is-selected {
		background-color: #e5e7fa;
		color: #000000;
	}
`;

const Actions = styled('div')`
	display: flex;
`;

const columnOptions = [
	{ value: 'firstName', label: 'First Name' },
	{ value: 'lastName', label: 'Last Name' },
	{ value: 'email', label: 'Email Address' },
	{ value: 'school', label: 'School' },
	{ value: 'gradYear', label: 'Graduation Year' },
	{ value: 'status', label: 'Status' },
	{ value: 'needsReimbursment', label: 'Reimbursement' },
];

enum HackerStatus {
	created = 'created',
	verified = 'verified',
	started = 'started',
	submitted = 'submitted',
	accepted = 'accepted',
	confirmed = 'confirmed',
	rejected = 'rejected',
}

// TODO(alan): convert status from hackerData JSON from types string to HackerStatus and remove union type
interface Hacker {
	firstName: string;
	lastName: string;
	email: string;
	gradYear?: number;
	school?: string;
	status: HackerStatus | string;
	needsReimbursement?: boolean;
}

interface Option {
	label: string;
	value: string;
}

interface Props {
	data: Hacker[];
}

export const HackerTable: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const [sortBy, setSortBy] = useState('firstName');
	const [sortDirection, setSortDirection] = useState<SortDirectionType>(SortDirection.ASC);
	const [sortedData, setSortedData] = useState<Hacker[]>(props.data);
	const [searchValue, setSearchValue] = useState('');
	const [useRegex, setUseRegex] = useState(false);
	const [selectedColumns, setSelectedColumns] = useState<Option[]>([columnOptions[0]]);

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

	useEffect(() => {
		// add case for Regex?
		onSearch(searchValue);
	}, [selectedColumns]);

	// remove multi-options when switching to single select
	useEffect(() => {
		if (selectedColumns.length > 0) {
			setSelectedColumns([selectedColumns[0]]);
		}
	}, [useRegex]);

	const opts = {
		caseSensitive: true,
		shouldSort: false,
		tokenize: true,
		threshold: 0.5,
		distance: 100,
		location: 0,
		findAllMatches: true,
		keys: selectedColumns.map((col: Option) => col.value) as (keyof Hacker)[],
	};

	const generateRowClassName = ({ index }: { index: number }): string =>
		index < 0 ? 'headerRow' : index % 2 === 0 ? 'evenRow' : 'oddRow';

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

	const renderHeaderAsSVG = (
		{ dataKey, sortBy, sortDirection, label }: TableHeaderProps,
		svg: string
	): JSX.Element => {
		return (
			<>
				<img alt={String(label)} src={svg} />
				{sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
			</>
		);
	};

	const checkmarkRenderer = ({ cellData }: TableCellProps) => {
		return <Checkmark value={cellData} />;
	};

	const actionRenderer = ({ cellData }: TableCellProps) => {
		return (
			<Actions>
				<RadioSlider option1="Accept" option2="Undecided" option3="Reject" />
				<TableButton>View</TableButton>
			</Actions>
		);
	};

	const rowRenderer = (props: TableRowProps) => {
		return <Row {...props} />;
		// return (
		// 	<div key={props.index} className={props.className} style={props.style}>
		// 		{props.columns}
		// 	</div>
		// );
	};

	// const SomeComponent = ({ selectableRef, selected, selecting }: any): JSX.Element => (
	// 	<div ref={selectableRef}>Test</div>
	// );
	// const SelectableComponent: JSX.Element = createSelectable(<SomeComponent/>);

	const statusRenderer = ({ cellData }: TableCellProps) => {
		const generateColor = (value: HackerStatus) => {
			switch (value.toLowerCase()) {
				case HackerStatus.created:
					return STRINGS.COLOR_PALETTE[0];
				case HackerStatus.verified:
					return STRINGS.COLOR_PALETTE[1];
				case HackerStatus.started:
					return STRINGS.COLOR_PALETTE[2];
				case HackerStatus.submitted:
					return STRINGS.COLOR_PALETTE[3];
				case HackerStatus.accepted:
					return STRINGS.COLOR_PALETTE[4];
				case HackerStatus.confirmed:
					return STRINGS.COLOR_PALETTE[5];
				case HackerStatus.rejected:
					return STRINGS.COLOR_PALETTE[6];
				default:
					return STRINGS.ACCENT_COLOR;
			}
		};

		return <Status value={cellData} generateColor={generateColor} />;
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

	const onSearch = (value: string) => {
		if (value !== '') {
			if (!useRegex) {
				// fuzzy filtering
				const fuse = new Fuse(props.data, opts);
				setSortedData(fuse.search(value));
				// console.log(fuse.search(value));
			} else {
				let regex: RegExp;
				let isValid = true;
				try {
					regex = new RegExp(value, 'i');
				} catch (e) {
					isValid = false;
				}
				if (isValid) {
					console.log(value);
					console.log('Regex searching!');
					// TODO(alan): replace any with Hacker
					const newSortedData = props.data.filter((user: any) => {
						console.log(user[selectedColumns[0].value]);
						return regex.test(user[selectedColumns[0].value]);
					});
					setSortedData(newSortedData);
				} else {
					console.log('Invalid regular expression');
				}
			}
		} else {
			// reset
			setSortedData(props.data);
		}
		setSearchValue(value);
	};

	// TODO(alan): remove any type.
	return (
		<TableLayout>
			<TableOptions>
				<ColumnSelect
					isMulti={!useRegex}
					name="colors"
					defaultValue={[columnOptions[0]]}
					value={selectedColumns}
					options={columnOptions}
					className="basic-multi-select"
					classNamePrefix="select"
					onChange={(selected: any) => {
						if (Array.isArray(selected)) setSelectedColumns(selected);
						else setSelectedColumns([selected]);
					}}
				/>
				<SearchBox
					value={searchValue}
					placeholder={useRegex ? "Search by regex string, e.g. '^[a-b].*'" : 'Search by text'}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => onSearch(event.target.value)}
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
						return (
							<SelectableGroup
								clickClassName="selected"
								enableDeselect
								tolerance={0}
								allowClickWithoutSelected={false}
								duringSelection={() => console.log('duringSelection')}
								onSelectionClear={() => console.log('onSelectionClear')}
								onSelectionFinish={() => console.log('onSelectionFinish')}
								ignoreList={[]}>
								{/* <Row /> */}
								<StyledTable
									width={width}
									height={height}
									headerHeight={20}
									rowHeight={30}
									rowCount={sortedData.length}
									rowClassName={generateRowClassName}
									rowGetter={({ index }: { index: number }) => sortedData[index]}
									rowRenderer={rowRenderer}
									sortBy={sortBy}
									sortDirection={sortDirection}
									sort={sort}>
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
									<Column
										className="column"
										label="Status"
										dataKey="status"
										width={100}
										minWidth={90}
										headerRenderer={renderHeaderAsLabel}
										cellRenderer={statusRenderer}
									/>
									<Column
										className="column"
										label="Requires Travel Reimbursement?"
										dataKey="needsReimbursement"
										width={30}
										headerRenderer={({ dataKey, sortBy, sortDirection, label }: TableHeaderProps) =>
											renderHeaderAsSVG(
												{
													dataKey: dataKey,
													sortBy: sortBy,
													sortDirection: sortDirection,
													label: label,
												},
												plane
											)
										}
										cellRenderer={checkmarkRenderer}
									/>
									<Column
										className="column"
										label="Actions"
										dataKey="actions"
										width={275}
										minWidth={275}
										headerRenderer={renderHeaderAsLabel}
										cellRenderer={actionRenderer}
									/>
								</StyledTable>
							</SelectableGroup>
						);
					}}
				</AutoSizer>
			</TableData>
		</TableLayout>
	);
};

export default HackerTable;

// Copyright (c) 2019 Vanderbilt University
