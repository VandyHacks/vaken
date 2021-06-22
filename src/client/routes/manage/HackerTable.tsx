import React, { useContext, useState, useEffect, useRef, FC } from 'react';
import { AutoSizer, SortDirection } from 'react-virtualized';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import Select from 'react-select';
import { ValueType } from 'react-select/src/types';
import { SelectableGroup, SelectAll, DeselectAll } from 'react-selectable-fast';
import { CSVLink } from 'react-csv';
import { useHistory } from 'react-router-dom';

import { use } from 'passport';
import { ToggleSwitch } from '../../components/Buttons/ToggleSwitch';
import { Button } from '../../components/Buttons/Button';
import { SearchBox } from '../../components/Input/SearchBox';
import { FlexRow, FlexColumn } from '../../components/Containers/FlexContainers';
import STRINGS from '../../assets/strings.json';
import { TableCtxI, TableContext, Option, SearchCriteria } from '../../contexts/TableContext';
import {
	Hacker,
	useHackerStatusMutation,
	useEventsQuery,
	ApplicationStatus,
	useHackerStatusesMutation,
	useResumeDumpUrlQuery,
} from '../../generated/graphql';
import RemoveButton from '../../assets/img/remove_button.svg';
import AddButton from '../../assets/img/add_button.svg';

import { HackerTableRows } from './HackerTableRows';
import { DeselectElement, SliderInput } from './SliderInput';
import { QueriedHacker, SortFnProps } from './HackerTableTypes';

const Float = styled.div`
	position: fixed;
	bottom: 3.5rem;
	right: 16rem;
	margin-right: 1rem;
`;

const TableLayout = styled('div')`
	width: 100%;
	box-sizing: border-box;
	flex: 1;
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

const AddRemBtn = styled.img`
	display: inline-block;
	height: 2rem;
	margin-left: 10px;
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
			border: 0.0625rem solid ${STRINGS.ACCENT_COLOR_DARK};
		}
		:hover:not(.select__control--is-focused) {
			border: 0.0625rem solid #ecebed;
		}
		:hover.select__control--is-focused {
			border: 0.0625rem solid ${STRINGS.ACCENT_COLOR_DARK};
		}
	}
	.select__control--is-focused,
	.select__control--is-selected {
		border: 0.0625rem solid ${STRINGS.ACCENT_COLOR_DARK};
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

const Count = styled.div`
	h3 {
		font-weight: bold;
	}

	margin-left: 10px;
	text-align: right;
`;

const columnOptions: { label: string; value: keyof QueriedHacker }[] = [
	{ label: 'First Name', value: 'firstName' },
	{ label: 'Last Name', value: 'lastName' },
	{ label: 'Email Address', value: 'email' },
	{ label: 'School', value: 'school' },
	{ label: 'Graduation Year', value: 'gradYear' },
	{ label: 'Status', value: 'status' },
];

// handles basic alphanumeric sorting
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

const onRemoveSearchCriterion = (ctx: TableCtxI, indexToRemove: number): (() => void) => {
	return () => {
		ctx.update(draft => {
			draft.searchCriteria = draft.searchCriteria.filter((_, index) => index !== indexToRemove);
		});
	};
};

const onAddSearchCriterion = (ctx: TableCtxI): (() => void) => {
	return () => {
		ctx.update(draft => {
			draft.searchCriteria.push(SearchCriteria.Create());
		});
	};
};

const onSearchBoxEntry = (
	ctx: TableCtxI,
	index: number
): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
	return e => {
		const { value } = e.target;
		ctx.update(draft => {
			draft.searchCriteria[index].searchValue = value;
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
			draft.selectedRowsIds = [];
		});
};

// when draggable selection is completed
const onSelectionFinish = (ctx: TableCtxI): ((keys: JSX.Element[]) => void) => {
	return (keys: JSX.Element[]): void => {
		if (keys.length > 0) {
			ctx.update(draft => {
				draft.hasSelection = true;
				draft.selectedRowsIds = keys.map((key: JSX.Element) => key.props.rowData.id);
			});
		}
	};
};

const onRegexToggle = (ctx: TableCtxI, index: number): ((p: boolean) => void) => {
	return (p: boolean) =>
		ctx.update(draft => {
			draft.searchCriteria[index].fuzzySearch = p;
		});
};

const onTableColumnSelect = (
	ctx: TableCtxI,
	index: number
): ((s: ValueType<Option, true>) => void) => {
	// Dependency injection
	return (s: ValueType<Option, true>) =>
		ctx.update(draft => {
			if (s == null) {
				draft.searchCriteria[index].selectedColumns = [];
			} else {
				// react-select is bad: https://github.com/JedWatson/react-select/issues/4252
				draft.searchCriteria[index].selectedColumns = (Array.isArray(s) ? s : [s]) as Option[];
			}
		});
};

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

export interface HackerTableProps {
	data: QueriedHacker[];
	isSponsor: boolean;
	viewResumes: boolean;
}

const HackerTable: FC<HackerTableProps> = ({
	data,
	isSponsor = false,
	viewResumes = false,
}: HackerTableProps): JSX.Element => {
	const table = useContext(TableContext);
	const [eventIds, setEventIds] = useState<string[]>([]);
	const [sortedData, setSortedData] = useState(data);
	const deselect = useRef<DeselectElement>(null);
	const [updateStatus] = useHackerStatusMutation();
	const [updateStatuses] = useHackerStatusesMutation();
	const resumeDumpUrlQuery = useResumeDumpUrlQuery();
	const { data: { resumeDumpUrl = '' } = {} } = resumeDumpUrlQuery || {};

	const {
		selectAll,
		hasSelection,
		searchCriteria,
		sortBy,
		sortDirection,
		selectedRowsIds,
	} = table.state;

	const { data: eventData, loading: eventLoading, error: eventError } = useEventsQuery();
	if (eventError) console.error(eventError);

	let options: Record<string, string>[] = [];
	if (eventData && eventData.events) {
		options = eventData.events.map(e => ({ label: e.name, value: e.id.toString() }));
	}

	useEffect(() => {
		// Only search one column in regex mode
		table.update(draft => {
			draft.searchCriteria.forEach((searchCriterion, index) => {
				if (!searchCriterion.fuzzySearch && searchCriterion.selectedColumns.length > 1) {
					draft.searchCriteria[index].selectedColumns = [
						draft.searchCriteria[index].selectedColumns[0],
					];
				}
			});
		});
		// eslint wants to auto-fix this to include table and selectedColumns, but this breaks the toggle
		// eslint-disable-next-line
	}, [searchCriteria]);

	useEffect(() => {
		// filter and sort data
		const newData = searchCriteria.reduce(SearchCriteria.filter, [...data]);
		let filteredData = newData;
		if (eventIds.length > 0) {
			filteredData = newData.filter(
				(hacker: Partial<Hacker>) =>
					hacker &&
					hacker.eventsAttended &&
					hacker.eventsAttended.some(eventId => eventIds.includes(eventId))
			);
		}

		// Sort data based on props and context
		if (sortBy && sortDirection) {
			filteredData.sort((a, b) =>
				sortDirection === SortDirection.DESC
					? collator.compare(`${b[sortBy]}`, `${a[sortBy]}`)
					: collator.compare(`${a[sortBy]}`, `${b[sortBy]}`)
			);
		}

		setSortedData(filteredData);
	}, [data, sortBy, sortDirection, searchCriteria, eventIds]);

	// handles the text or regex search and sets the sortedData state with the updated row list
	// floating button that onClick toggles between selecting all or none of the rows
	const SelectAllButton = (
		<div
			style={{
				position: 'fixed',
				bottom: '3.25rem',
				right: '3.75rem',
			}}>
			<Button large onClick={onToggleSelectAll(table)}>
				{selectAll || hasSelection ? 'Deselect All' : 'Select All'}
			</Button>
		</div>
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
			const { status, id } = sortedData[index];
			if (!isSelectable(status)) {
				className = className.concat(' ignore-select');
			} else if (selectAll || selectedRowsIds.includes(id)) {
				className = className.concat(' selected');
			}
		}
		return className;
	};

	return (
		<TableLayout>
			<TableOptions>
				<FlexColumn>
					{!eventLoading && (
						<div style={{ paddingBottom: '5px' }}>
							<span style={{ paddingRight: '5px' }}>Filter By Events Attended: </span>
							<ColumnSelect
								isMulti
								options={options}
								onChange={(selected: Record<string, string>[]) => {
									if (!selected) setEventIds([]);
									else setEventIds(selected.map(s => s.value));
								}}
							/>
						</div>
					)}
					{searchCriteria.map((criterion, index) => (
						// eslint-disable-next-line
						<FlexRow key={index}>
							<ColumnSelect
								isMulti={criterion.fuzzySearch}
								name="colors"
								defaultValue={[columnOptions[0]]}
								value={criterion.selectedColumns}
								options={columnOptions}
								className="basic-multi-select"
								classNamePrefix="select"
								onChange={(value: ValueType<Option, true>) =>
									onTableColumnSelect(table, index)(value)
								}
							/>
							<SearchBox
								width="100%"
								value={criterion.searchValue}
								placeholder={
									criterion.fuzzySearch
										? 'Search by text'
										: "Search by regex string, e.g. '^[a-b].*'"
								}
								onChange={onSearchBoxEntry(table, index)}
								minWidth="15rem"
								hasIcon
								flex
							/>
							<ToggleSwitch
								label="Fuzzy Search: "
								checked={criterion.fuzzySearch}
								onChange={onRegexToggle(table, index)}
							/>
							<AddRemBtn src={AddButton} alt="add" onClick={onAddSearchCriterion(table)} />
							{searchCriteria.length > 1 ? (
								<AddRemBtn
									src={RemoveButton}
									alt="remove"
									onClick={onRemoveSearchCriterion(table, index)}
								/>
							) : (
								<div style={{ width: 'calc(10px + 2rem)' }} />
							)}
						</FlexRow>
					))}
				</FlexColumn>
				<Count style={{ margin: '20px' }}>
					<h3>Num Shown:</h3>
					<p>{sortedData.length}</p>
					{selectedRowsIds.length > 0 ? (
						<>
							<h3>Num Selected:</h3>
							<p>{selectedRowsIds.length}</p>
						</>
					) : null}
				</Count>
				{viewResumes && (
					<Button
						onClick={() => {
							console.log('url:', resumeDumpUrl);
							window.open(resumeDumpUrl);
						}}>
						Download Resumes
					</Button>
				)}
				<CSVLink style={{ margin: '20px' }} data={sortedData} filename="exportedData.csv">
					Export
				</CSVLink>
			</TableOptions>
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
						<HackerTableRows
							width={width}
							height={height}
							updateStatus={updateStatus}
							sortedData={sortedData}
							onSortColumnChange={onSortColumnChange}
							generateRowClassName={generateRowClassName}
							table={table}
							isSponsor={isSponsor}
							viewResumes={viewResumes}
						/>
						{selectAll || hasSelection ? (
							<DeselectAll ref={deselect}>{SelectAllButton}</DeselectAll>
						) : (
							<SelectAll
								onClick={() =>
									table.update(draft => {
										draft.hasSelection = true;
										draft.selectedRowsIds = sortedData
											.filter(row => isSelectable(row.status))
											.map(row => row.id);
										console.log(draft.selectedRowsIds);
									})
								}>
								{SelectAllButton}
							</SelectAll>
						)}
						{hasSelection && (
							<Float className="ignore-select">
								<SliderInput
									updateStatuses={updateStatuses}
									deselect={deselect}
									selectedRowsIds={selectedRowsIds}
									sortBy={sortBy}
								/>
							</Float>
						)}
					</SelectableGroup>
				)}
			</AutoSizer>
		</TableLayout>
	);
};

export default HackerTable;
