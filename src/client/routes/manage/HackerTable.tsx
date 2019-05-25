import React, { FunctionComponent, useContext, useState, useEffect, useRef } from 'react';
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
import Select from 'react-select';
import { ValueType } from 'react-select/lib/types';
import { Link } from 'react-router-dom';
import { Mutation, MutationFn, FetchResult } from 'react-apollo';
import { gql } from 'apollo-boost';
import { SelectableGroup, SelectAll, DeselectAll } from 'react-selectable-fast';
import TableButton from '../../components/Buttons/TableButton';
import ToggleSwitch from '../../components/Buttons/ToggleSwitch';
import RadioSlider from '../../components/Buttons/RadioSlider';
import FloatingButton from '../../components/Buttons/FloatingButton';
import Status from '../../components/Text/Status';
import Checkmark from '../../components/Symbol/Checkmark';
import SearchBox from '../../components/Input/SearchBox';
import plane from '../../assets/img/plane.svg';
import STRINGS from '../../assets/strings.json';
import { GET_HACKERS } from './ManageHackers';
import { TableCtxI, TableContext, Hacker, HackerStatus, Option } from '../../contexts/TableContext';
import Row from './Row';

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

const Float = styled.div`
	position: fixed;
	bottom: 3.5rem;
	right: 11.75rem;
	margin-right: 1rem;
`;

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

const TableLayout = styled('div')`
	width: 100%;
	box-sizing: border-box;
	flex: 1 0 auto;
	display: flex;
	flex-direction: column;
`;

const TableOptions = styled('div')`
	display: flex;
	flex-flow: row nowrap;
	align-items: center;
	justify-content: space-between;
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

interface DeselectElement extends HTMLDivElement {
	context: {
		selectable: {
			clearSelection: () => void;
		};
	};
}

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

// renders a solid checkmark if true, else an empty circle
const checkmarkRenderer = ({ cellData }: TableCellProps): JSX.Element => {
	return <Checkmark value={cellData} />;
};

// Note: the following two mutation functions can likely be consolidated with some deep backend refactoring
// mutation to update a single hacker status
const mutateHackerStatus = (
	mutationFunction: MutationFn,
	variables: { email: string; status: string }
): Promise<void | FetchResult> => {
	return mutationFunction({
		update: (proxy, { data: { updateHackerStatus } }) => {
			try {
				// updateHackerStatusAsBatch is the newStatus after mutation
				const queryData = proxy.readQuery({ query: GET_HACKERS }) as {
					hackers: Hacker[] | null;
				};
				if (queryData && queryData.hackers) {
					queryData.hackers = queryData.hackers.map(({ email, status, ...h }: Hacker) => {
						return email === variables.email
							? { email, status: updateHackerStatus, ...h }
							: { email, status, ...h };
					});
					proxy.writeQuery({ data: queryData, query: GET_HACKERS });
				}
			} catch (e) {
				console.error(e);
			}
		},
		variables,
	});
};

// mutation to update a multiple hacker statuses
const mutateHackerStatusAsBatch = (
	mutationFunction: MutationFn,
	variables: { emails: string[]; status: string }
): Promise<void | FetchResult> => {
	return mutationFunction({
		update: (proxy, { data: { updateHackerStatusAsBatch } }) => {
			try {
				// updateHackerStatusAsBatch is the newStatus after mutation
				const queryData = proxy.readQuery({ query: GET_HACKERS }) as {
					hackers: Hacker[] | null;
				};
				if (queryData && queryData.hackers) {
					queryData.hackers = queryData.hackers
						? queryData.hackers.map(({ email, status, ...h }: Hacker) => {
								return variables.emails.includes(email)
									? { email, status: updateHackerStatusAsBatch, ...h }
									: { email, status, ...h };
						  })
						: null;
				}
				proxy.writeQuery({ data: queryData, query: GET_HACKERS });
			} catch (e) {
				console.error(e);
			}
		},
		variables,
	});
};

// maps the radio slider labels to the hacker status
const processSliderInput = (input: string): string => {
	switch (input.toLowerCase()) {
		case 'accept':
			return HackerStatus.Accepted;
		case 'reject':
			return HackerStatus.Rejected;
		case 'undecided':
		default:
			return HackerStatus.Submitted;
	}
};

// action column that contains the actionable buttons
const actionRenderer = ({ rowData }: TableCellProps): JSX.Element => {
	const { email, status } = rowData;
	let sliderValue: string;
	switch (status) {
		case HackerStatus.Accepted:
			sliderValue = 'Accept';
			break;
		case HackerStatus.Rejected:
			sliderValue = 'Reject';
			break;
		default:
			sliderValue = 'Undecided';
	}

	return (
		<Actions className="ignore-select">
			<Mutation mutation={UPDATE_STATUS}>
				{(mutation: MutationFn) => (
					<RadioSlider
						option1="Accept"
						option2="Undecided"
						option3="Reject"
						value={sliderValue}
						onChange={(input: string) => {
							const newStatus = processSliderInput(input);
							mutateHackerStatus(mutation, {
								email: rowData.email as string,
								status: newStatus,
							});
						}}
						disable={
							status !== HackerStatus.Accepted &&
							status !== HackerStatus.Rejected &&
							status !== HackerStatus.Submitted
						}
					/>
				)}
			</Mutation>
			<Link
				style={{ textDecoration: 'none' }}
				to={{ pathname: '/manageHackers/hacker', state: { email } }}>
				<TableButton>View</TableButton>
			</Link>
		</Actions>
	);
};

// wrapper to use createSelectable() from react-selectable-fast
const rowRenderer = (
	props: TableRowProps & { selectableRef: string; selecting: boolean; selected: boolean }
): JSX.Element => {
	return <Row {...props} />;
};

// mapping from status labels to the colored label images
const statusRenderer = ({ cellData }: TableCellProps): JSX.Element => {
	const generateColor = (value: HackerStatus): string => {
		switch (value) {
			case HackerStatus.Created:
				return STRINGS.COLOR_PALETTE[0];
			case HackerStatus.Verified:
				return STRINGS.COLOR_PALETTE[1];
			case HackerStatus.Started:
				return STRINGS.COLOR_PALETTE[2];
			case HackerStatus.Submitted:
				return STRINGS.COLOR_PALETTE[3];
			case HackerStatus.Accepted:
				return STRINGS.COLOR_PALETTE[4];
			case HackerStatus.Confirmed:
				return STRINGS.COLOR_PALETTE[5];
			case HackerStatus.Rejected:
				return STRINGS.COLOR_PALETTE[6];
			default:
				return STRINGS.ACCENT_COLOR;
		}
	};
	return <Status value={cellData} generateColor={generateColor} />;
};

// handles basic alphanumeric sorting
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

// define thresholds for fuzzy searching
const fuseOpts = {
	caseSensitive: true,
	distance: 100,
	findAllMatches: true,
	location: 0,
	shouldSort: false,
	threshold: 0.5,
	tokenize: true,
};

const onSearchBoxEntry = (ctx: TableCtxI): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
	return e => {
		const { value } = e.target;
		ctx.update(draft => {
			draft.searchValue = value;
		});
	};
};

const onToggleSelectAll = (ctx: TableCtxI): (() => void) => {
	return () => {
		ctx.update(draft => {
			draft.selectAll = !draft.selectAll;
		});
	};
};

// when draggable selection is cleared
const onSelectionClear = (ctx: TableCtxI): ((p: boolean) => void) => {
	return (p: boolean) =>
		ctx.update(draft => {
			draft.selectAll = false;
			draft.hasSelection = p;
			draft.selectedRowsEmails = [];
		});
};

// when draggable selection is completed
const onSelectionFinish = (ctx: TableCtxI): ((keys: JSX.Element[]) => void) => {
	return (keys: JSX.Element[]): void => {
		if (keys.length > 0) {
			ctx.update(draft => {
				draft.hasSelection = true;
				draft.selectedRowsEmails = keys.map((key: JSX.Element) => key.props.rowData.email);
			});
		}
	};
};

const onRegexToggle = (ctx: TableCtxI): ((p: boolean) => void) => {
	return (p: boolean) =>
		ctx.update(draft => {
			draft.fuzzySearch = p;
		});
};

const onTableColumnSelect = (ctx: TableCtxI): ((s: ValueType<Option>) => void) => {
	// Dependency injection
	return (s: ValueType<Option>) =>
		ctx.update(draft => {
			if (s == null) {
				draft.selectedColumns = [];
			} else {
				draft.selectedColumns = Array.isArray(s) ? s : [s];
			}
		});
};

interface SortFnProps {
	sortBy?: string;
	sortDirection?: SortDirectionType;
}
const onSortColumnChange = (ctx: TableCtxI): ((p: SortFnProps) => void) => {
	return ({ sortBy, sortDirection }) => {
		const { sortBy: prevSortBy, sortDirection: prevSortDirection } = ctx.state;
		ctx.update(draft => {
			draft.sortBy =
				prevSortBy === sortBy && prevSortDirection === SortDirection.DESC ? undefined : sortBy;
			draft.sortDirection =
				prevSortBy === sortBy && prevSortDirection === SortDirection.DESC
					? undefined
					: sortDirection;
		});
	};
};

interface Props {
	data: Hacker[];
}

// header renderer for travel reimbursement part of table
const reimbursementHeaderRenderer = ({ dataKey, sortBy, sortDirection, label }: TableHeaderProps) =>
	renderHeaderAsSVG(
		{
			dataKey,
			label,
			sortBy,
			sortDirection,
		},
		plane
	);

export const HackerTable: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const table = useContext(TableContext);

	const {
		selectAll,
		hasSelection,
		searchValue,
		fuzzySearch,
		selectedColumns,
		sortBy,
		sortDirection,
		selectedRowsEmails,
	} = table.state;

	const { data } = props;

	const deselect = useRef<DeselectElement>(null);
	const [sortedData, setSortedData] = useState(data);

	useEffect(() => {
		// Only search one column in regex mode
		if (!fuzzySearch && selectedColumns.length > 0) {
			table.update(draft => {
				draft.selectedColumns = [selectedColumns[0]];
			});
		}
		// esline wants to auto-fix this to include table and selectedColumns, but this breaks the toggle
		// eslint-disable-next-line
	}, [fuzzySearch]);

	useEffect(() => {
		// filter and sort data
		let newData = [...data];

		if (searchValue.trim() !== '' && fuzzySearch) {
			// Fuzzy search selected columns
			newData = new Fuse(newData, {
				keys: selectedColumns.map((col: Option) => col.value) as (keyof Hacker)[],
				...fuseOpts,
			}).search(searchValue);
		} else if (searchValue.trim() !== '') {
			// filter based on regex
			const regex = new RegExp(searchValue, 'i');
			// ternary for case when going for empty multi-select to empty single-select
			newData =
				selectedColumns.length > 0
					? newData.filter((hacker: Hacker) =>
							regex.test(hacker[selectedColumns[0].value] as string)
					  )
					: [];
		}

		// Sort data based on props and context
		if (sortBy && sortDirection) {
			newData.sort((a: Hacker, b: Hacker) =>
				sortDirection === SortDirection.DESC
					? collator.compare(b[sortBy] as string, a[sortBy] as string)
					: collator.compare(a[sortBy] as string, b[sortBy] as string)
			);
		}

		setSortedData(newData);
	}, [data, sortBy, sortDirection, selectedColumns, fuzzySearch, searchValue]);

	// handles the text or regex search and sets the sortedData state with the updated row list
	// floating button that onClick toggles between selecting all or none of the rows
	const SelectAllButton = (
		<FloatingButton onClick={onToggleSelectAll(table)}>
			{selectAll || hasSelection ? 'Deselect All' : 'Select All'}
		</FloatingButton>
	);

	// prevents hackers with certain statuses from being selected
	const isSelectable = (status: HackerStatus): boolean => {
		return (
			status === HackerStatus.Submitted ||
			status === HackerStatus.Accepted ||
			status === HackerStatus.Rejected
		);
	};

	// assigns the row names for styling and to prevent selection
	const generateRowClassName = ({ index }: { index: number }): string => {
		let className;
		if (index < 0) className = 'headerRow';
		else {
			className = index % 2 === 0 ? 'evenRow' : 'oddRow';
			const { status, email } = sortedData[index];
			if (!isSelectable(status)) {
				className = className.concat(' ignore-select');
			} else if (selectAll || selectedRowsEmails.includes(email)) {
				className = className.concat(' selected');
			}
		}
		return className;
	};

	return (
		<TableLayout>
			<TableOptions>
				<ColumnSelect
					isMulti={fuzzySearch}
					name="colors"
					defaultValue={[columnOptions[0]]}
					value={selectedColumns}
					options={columnOptions}
					className="basic-multi-select"
					classNamePrefix="select"
					onChange={(value: ValueType<Option>) =>
						onTableColumnSelect(table)(value as ValueType<Option>)
					}
				/>
				<SearchBox
					width="100%"
					value={searchValue}
					placeholder={fuzzySearch ? 'Search by text' : "Search by regex string, e.g. '^[a-b].*'"}
					onChange={onSearchBoxEntry(table)}
					minWidth="15rem"
					hasIcon
					flex
				/>
				<ToggleSwitch
					label="Fuzzy Search: "
					checked={fuzzySearch}
					onChange={onRegexToggle(table)}
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
								onSelectionClear={onSelectionClear(table)}
								onSelectionFinish={onSelectionFinish(table)}
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
										headerRenderer={reimbursementHeaderRenderer}
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
									<SelectAll
										onClick={() =>
											table.update(draft => {
												draft.hasSelection = true;
												draft.selectedRowsEmails = sortedData
													.filter(row => isSelectable(row.status))
													.map(row => row.email);
											})
										}>
										{SelectAllButton}
									</SelectAll>
								)}
								{hasSelection && (
									<Mutation mutation={UPDATE_STATUS_AS_BATCH}>
										{(mutation: MutationFn) => (
											<Float className="ignore-select">
												<RadioSlider
													option1="Accept"
													option2="Undecided"
													option3="Reject"
													large
													value="Undecided"
													onChange={(input: string) => {
														const newStatus = processSliderInput(input);
														mutateHackerStatusAsBatch(mutation, {
															emails: selectedRowsEmails,
															status: newStatus,
														});
														// to deselect afterwards, react-selectable-fast has no clean way to interface with a clearSelection function
														// so this is a workaround by simulating a click on the SelectAllButton
														if (
															sortBy === 'status' &&
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
