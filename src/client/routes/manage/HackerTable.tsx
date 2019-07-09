import React, { useContext, useState, useEffect, useRef, FC } from 'react';
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
	Index,
} from 'react-virtualized';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import Fuse from 'fuse.js';
import Select from 'react-select';
import { ValueType } from 'react-select/src/types';
import { SelectableGroup, SelectAll, DeselectAll } from 'react-selectable-fast';

import { ToggleSwitch } from '../../components/Buttons/ToggleSwitch';
import { RadioSlider } from '../../components/Buttons/RadioSlider';
import { FloatingButton } from '../../components/Buttons/FloatingButton';
import { Status } from '../../components/Text/Status';
import { Checkmark } from '../../components/Symbol/Checkmark';
import { SearchBox } from '../../components/Input/SearchBox';
import STRINGS from '../../assets/strings.json';
import { TableCtxI, TableContext, Option } from '../../contexts/TableContext';
import {
	useHackerStatusMutation,
	ApplicationStatus,
	useHackerStatusesMutation,
} from '../../generated/graphql';
import { Row } from './Row';
import actionRenderer from './ActionRenderer';
import { QueriedHacker, processSliderInput } from './HackerTableHelper';
import { reimbursementHeaderRenderer } from './ReimbursementHeader';

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
const columnOptions: { label: string; value: keyof QueriedHacker }[] = [
	{ label: 'First Name', value: 'firstName' },
	{ label: 'Last Name', value: 'lastName' },
	{ label: 'Email Address', value: 'email' },
	{ label: 'School', value: 'school' },
	{ label: 'Graduation Year', value: 'gradYear' },
	{ label: 'Status', value: 'status' },
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
	sortBy?: keyof QueriedHacker;
	sortDirection?: SortDirectionType;
}
const onSortColumnChange = (ctx: TableCtxI): ((p: SortFnProps) => void) => {
	return ({ sortBy, sortDirection }) => {
		const { sortBy: prevSortBy, sortDirection: prevSortDirection } = ctx.state;
		ctx.update(draft => {
			draft.sortBy =
				// Reset to unordered state if clicked when in decending order
				prevSortBy === sortBy && prevSortDirection === SortDirection.DESC ? undefined : sortBy;
			draft.sortDirection =
				prevSortBy === sortBy && prevSortDirection === SortDirection.DESC
					? undefined
					: sortDirection;
		});
	};
};

interface HackerTableProps {
	data: QueriedHacker[];
}

const HackerTable: FC<HackerTableProps> = ({ data }: HackerTableProps): JSX.Element => {
	const table = useContext(TableContext);
	const [sortedData, setSortedData] = useState(data);
	const deselect = useRef<DeselectElement>(null);
	const updateStatus = useHackerStatusMutation();
	const updateStatuses = useHackerStatusesMutation();

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
				keys: selectedColumns.map((col: Option) => col.value) as (keyof QueriedHacker)[],
				...fuseOpts,
			}).search(searchValue);
		} else if (searchValue.trim() !== '') {
			// filter based on regex
			const regex = new RegExp(searchValue, 'i');
			// ternary for case when going for empty multi-select to empty single-select
			newData =
				selectedColumns.length > 0
					? newData.filter(hacker => regex.test(`${hacker[selectedColumns[0].value]}`))
					: [];
		}

		// Sort data based on props and context
		if (sortBy && sortDirection) {
			newData.sort((a, b) =>
				sortDirection === SortDirection.DESC
					? collator.compare(`${b[sortBy]}`, `${a[sortBy]}`)
					: collator.compare(`${a[sortBy]}`, `${b[sortBy]}`)
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
	const isSelectable = (status: ApplicationStatus): boolean => {
		return (
			status === ApplicationStatus.Submitted ||
			status === ApplicationStatus.Accepted ||
			status === ApplicationStatus.Rejected
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
					{({ height, width }) => (
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
									cellRenderer={actionRenderer(updateStatus)}
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
								<Float className="ignore-select">
									<RadioSlider
										option1="Accept"
										option2="Undecided"
										option3="Reject"
										large
										value="Undecided"
										onChange={(input: string) => {
											const newStatus = processSliderInput(input);
											updateStatuses({
												variables: { input: { ids: selectedRowsEmails, status: newStatus } },
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
						</SelectableGroup>
					)}
				</AutoSizer>
			</TableData>
		</TableLayout>
	);
};

export default HackerTable;
