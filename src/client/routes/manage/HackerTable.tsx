import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
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
import FloatingButton from '../../components/Buttons/FloatingButton';
import Status from '../../components/Text/Status';
import Checkmark from '../../components/Symbol/Checkmark';
import SearchBox from '../../components/Input/SearchBox';
import plane from '../../assets/img/plane.svg';
import STRINGS from '../../assets/strings.json';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
// TODO(alan): add d.ts file, most already defined here: https://github.com/valerybugakov/react-selectable-fast/blob/master/src/SelectableGroup.js
// @ts-ignore
import { SelectableGroup, SelectAll, DeselectAll } from 'react-selectable-fast';
import Row from './Row';
import 'babel-polyfill';
import { ID } from 'type-graphql';

const UPDATE_STATUS = gql`
	mutation UpdateHackerStatus($email: String!, $status: String!) {
		updateHackerStatus(email: $email, newStatus: $status)
	}
`;

const UPDATE_STATUS_AS_BATCH = gql`
	mutation UpdateHackerStatusAsBatch($emails: [String!]!, $status: String!) {
		updateHackerStatusAsBatch(emails: $emails, newStatus: $status)
	}
`;

const GET_HACKERS = gql`
	query {
		getAllHackers {
			status
		}
	}
`;

const Float = styled.div`
	position: fixed;
	bottom: 3.5rem;
	right: 11.75rem;
	margin-right: 1rem;
`;

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

const TableLayout = styled('div')`
	width: 100%;
	box-sizing: border-box;
	flex: 1 0 auto;
	display: flex;
	flex-direction: column;
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
	{ label: 'First Name', value: 'firstName' },
	{ label: 'Last Name', value: 'lastName' },
	{ label: 'Email Address', value: 'email' },
	{ label: 'School', value: 'school' },
	{ label: 'Graduation Year', value: 'gradYear' },
	{ label: 'Status', value: 'status' },
	{ label: 'Reimbursement', value: 'needsReimbursment' },
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

interface DeselectElement extends HTMLDivElement {
	context: {
		selectable: {
			clearSelection: () => void;
		};
	};
}

export const HackerTable: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const [sortByState, setSortByState] = useState<string | null>(null);
	const [sortDirectionState, setSortDirectionState] = useState<SortDirectionType | null>(null);
	// Used [...props.data] to make a copy since do not want assignment, which would motify props.data after sort
	// TODO(alan): explore immutables instead
	const [sortedData, setSortedData] = useState<Hacker[]>([...props.data]);
	const [searchValue, setSearchValue] = useState('');
	const [useRegex, setUseRegex] = useState(false);
	const [selectedColumns, setSelectedColumns] = useState<Option[]>([columnOptions[0]]);
	const [selectAll, setSelectAll] = useState(false);
	const [hasSelection, setHasSelection] = useState(false);
	const [selectedRowsEmails, setSelectedRowsEmails] = useState<string[]>([]);
	const deselect = useRef<DeselectElement>(null);

	const sortData = ({
		sortBy,
		sortDirection,
		update,
		data,
	}: {
		sortBy: string | null;
		sortDirection: SortDirectionType | null;
		update: boolean;
		data?: Hacker[];
	}) => {
		// no sort if sortBy is null and sortDirection is null
		if (!sortBy || !sortDirection) {
			return [...props.data];
		}

		// sort alphanumerically
		const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

		// TODO: replace any
		let newSortedData = ((update || !data ? [...props.data] : data) as any).sort((a: any, b: any) =>
			collator.compare(a[sortBy], b[sortBy])
		);
		if (sortDirection === SortDirection.DESC) {
			newSortedData = newSortedData.reverse();
		}
		return newSortedData;
	};

	// Also acts as a compoentDidMount to implement an initial sort
	// This is for updating the table when the hacker status changes
	useEffect(() => {
		console.log('data from GraphQL is changing');
		onSearch(searchValue);
	}, [props.data]);

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
		distance: 100,
		findAllMatches: true,
		keys: selectedColumns.map((col: Option) => col.value) as (keyof Hacker)[],
		location: 0,
		shouldSort: false,
		threshold: 0.5,
		tokenize: true,
	};

	// assigns the row names for styling and to prevent selection
	const generateRowClassName = ({ index }: { index: number }): string => {
		let className = index < 0 ? 'headerRow' : index % 2 === 0 ? 'evenRow' : 'oddRow';
		if (className !== 'headerRow') {
			const status = sortedData[index].status;
			if (status !== 'Submitted' && status !== 'Accepted' && status !== 'Rejected') {
				className = className.concat(' ignore-select');
			}
		}
		return className;
	};

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

	// renders an svg instead of a text label, will with a clickable sort indicator
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

	// mutation to update a single hacker status
	// TODO(alan): remove any type
	const updateHackerStatus = async (
		mutation: any,
		variables: { email: string; status: string }
	): Promise<string> => {
		const result = await mutation({
			mutation: UPDATE_STATUS,
			refetchQueries: [{ query: GET_HACKERS }],
			variables: variables,
		});
		return result.data.updateHackerStatus;
	};

	// maps the radio slider labels to the hacker status
	const processSliderInput = (input: string) => {
		switch (input.toLowerCase()) {
			case 'accept':
				return 'Accepted';
			case 'reject':
				return 'Rejected';
			case 'undecided':
			default:
				return 'Submitted';
		}
	};

	// action column that contains the actionable buttons
	const actionRenderer = ({ rowData }: TableCellProps) => {
		// TODO(alan): extract onChange to own method
		const status = rowData.status.toLowerCase();
		const email = rowData.email;

		return (
			<Actions className="ignore-select">
				<Mutation mutation={UPDATE_STATUS}>
					{mutation => (
						<RadioSlider
							option1="Accept"
							option2="Undecided"
							option3="Reject"
							value={
								status === 'accepted' ? 'Accept' : status === 'rejected' ? 'Reject' : 'Undecided'
							}
							onChange={(input: string) => {
								let newStatus = processSliderInput(input);
								updateHackerStatus(mutation, {
									email: rowData.email as string,
									status: newStatus,
								}).then((updatedStatus: string) => {
									console.log(updatedStatus);
									// rowData.status = updatedStatus;
								});
							}}
							disable={status !== 'accepted' && status !== 'rejected' && status !== 'submitted'}
						/>
					)}
				</Mutation>
				<Link
					style={{ textDecoration: 'none' }}
					to={{ pathname: "/manageHackers/hacker", state: { email: email } }}>
					<TableButton>View</TableButton>
				</Link>
			</Actions>
		);
	};

	const rowRenderer = (
		props: TableRowProps & { selectableRef: any; selecting: boolean; selected: boolean }
	) => {
		return <Row {...props} />;
	};

	// mapping from status labels to the colored label images
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
		sortBy: string | null;
		sortDirection: SortDirectionType | null;
	}) => {
		// return to natural order after triple click on same column header
		// before new assignment sortByState and sortByState are the previous values
		let update = false;
		if (sortByState === sortBy && sortDirectionState === SortDirection.DESC) {
			sortBy = null;
			sortDirection = null;
		}
		setSortedData(sortData({ sortBy, sortDirection, update: false, data: sortedData }));
		setSortByState(sortBy);
		setSortDirectionState(sortDirection);
	};

	// handles the text or regex search and sets the sortedData state with the updated row list
	const onSearch = (value: string) => {
		if (value !== '') {
			if (!useRegex) {
				// fuzzy filtering
				const fuse = new Fuse(props.data, opts);
				setSortedData(
					sortData({
						sortBy: sortByState,
						sortDirection: sortDirectionState,
						update: false,
						data: fuse.search(value),
					})
				);
			} else {
				let regex: RegExp;
				let isValid = true;
				try {
					regex = new RegExp(value, 'i');
				} catch (e) {
					isValid = false;
				}
				if (isValid) {
					// TODO(alan): replace any with Hacker
					const newSortedData = [...props.data].filter((user: any) => {
						return regex.test(user[selectedColumns[0].value]);
					});
					setSortedData(
						sortData({
							sortBy: sortByState,
							sortDirection: sortDirectionState,
							update: false,
							data: newSortedData,
						})
					);
				} else {
					console.log('Invalid regular expression');
				}
			}
		} else {
			// reset
			// setSortedData([...props.data]);
			setSortedData(
				sortData({ sortBy: sortByState, sortDirection: sortDirectionState, update: true })
			);
		}
		setSearchValue(value);
	};

	// floating button that onClick toggles between selecting all or none of the rows
	const SelectAllButton = (
		<FloatingButton
			onClick={() => {
				setSelectAll(!selectAll);
			}}>
			{selectAll || hasSelection ? 'Deselect All' : 'Select All'}
		</FloatingButton>
	);

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
								deselectOnEsc
								tolerance={0}
								allowClickWithoutSelected={false}
								onSelectionClear={() => {
									setHasSelection(false);
									setSelectedRowsEmails([]);
								}}
								onSelectionFinish={(keys: [JSX.Element]) => {
									if (keys.length > 0) {
										setHasSelection(true);
										setSelectedRowsEmails(keys.map((key: JSX.Element) => key.props.rowData.email));
									}
								}}
								ignoreList={['.ignore-select']}
								resetOnStart>
								<StyledTable
									width={width}
									height={height}
									headerHeight={40}
									rowHeight={30}
									rowCount={sortedData.length}
									rowClassName={generateRowClassName}
									rowGetter={({ index }: { index: number }) => sortedData[index]}
									rowRenderer={rowRenderer}
									headerClassName="ignore-select"
									sortBy={sortByState}
									sortDirection={sortDirectionState}
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
										minWidth={20}
										headerRenderer={({ dataKey, sortBy, sortDirection, label }: TableHeaderProps) =>
											renderHeaderAsSVG(
												{
													dataKey: dataKey,
													label: label,
													sortBy: sortBy,
													sortDirection: sortDirection,
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
								{selectAll || hasSelection ? (
									<DeselectAll ref={deselect}>{SelectAllButton}</DeselectAll>
								) : (
									<SelectAll>{SelectAllButton}</SelectAll>
								)}
								{hasSelection && (
									<Mutation mutation={UPDATE_STATUS_AS_BATCH}>
										{mutation => (
											<Float className="ignore-select">
												<RadioSlider
													option1="Accept"
													option2="Undecided"
													option3="Reject"
													large={true}
													value="Undecided"
													onChange={(input: string) => {
														let newStatus = processSliderInput(input);
														mutation({
															variables: { emails: selectedRowsEmails, status: newStatus },
															refetchQueries: [{ query: GET_HACKERS }],
														});
														// to deselect afterwards, react-selectable-fast has no clean way to interface with a clearSelection function
														// so this is a workaround by simulating a click on the SelectAllButton
														if (
															sortByState === 'status' &&
															deselect &&
															deselect.current &&
															deselect.current.context &&
															deselect.current.context.selectable
														) {
															deselect.current.context.selectable.clearSelection();
														}
													}}
												/>
											</Float>
										)}
									</Mutation>
								)}
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
