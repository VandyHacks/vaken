import React, { useContext, useState, useEffect, FC, useCallback } from 'react';
import { AutoSizer, SortDirection, RowMouseEventHandlerParams } from 'react-virtualized';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import Select from 'react-select';
import Fuse from 'fuse.js';
import { Button } from '../../components/Buttons/Button';
import { generateRowClassName, createSubmitHandler, CHECK_IN_EVENT_TYPE } from './helpers';

import { ToggleSwitch } from '../../components/Buttons/ToggleSwitch';
import { SearchBox } from '../../components/Input/SearchBox';
import { TableCtxI, TableContext, fuseOpts } from '../../contexts/TableContext';
import {
	useRegisterNfcuidWithUserMutation,
	useCheckInUserToEventMutation,
	useRemoveUserFromEventMutation,
	useCheckInUserToEventByNfcMutation,
	useRemoveUserFromEventByNfcMutation,
} from '../../generated/graphql';

import { NfcTableRows } from './NfcTableRows';

import { QueriedEvent, QueriedHacker, SortFnProps } from './NfcTableTypes';

import { NO_EVENTS_MESSAGE, DARK_TEXT_COLOR } from '../../assets/strings';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';

const TableLayout = styled('div')`
	width: 100%;
	box-sizing: border-box;
	flex: 1 0 auto;
	display: flex;
	flex-direction: column;
`;

const TableOptions = styled('div')`
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 1rem;
`;

const EventSelect = styled(Select)`
	min-width: 15rem;
	width: 100%;
	display: inline-block;
	font-size: 1rem;
	margin-right: 1rem;
`;
const UnadmitToggleWrapper = styled('div')`
	margin: 0.5rem 1rem 0.5rem 0;
`;

const ManualToggleWrapper = styled('div')`
	margin: 0.5rem 1rem 0.5rem 0;
`;

// handles basic alphanumeric sorting
const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

const onSearchBoxEntry = (ctx: TableCtxI): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
	return e => {
		const { value } = e.target;
		ctx.update(draft => {
			draft.searchValue = value;
		});
	};
};

const onNfcBoxEntry = (ctx: TableCtxI): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
	return e => {
		const { value } = e.target;
		ctx.update(draft => {
			draft.nfcValue = value;
		});
	};
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

const generateOnRowClick = (
	setTopUserMatch: React.Dispatch<React.SetStateAction<string>>
): ((p: RowMouseEventHandlerParams) => void) => ({ rowData }) => {
	if (rowData && rowData.id) setTopUserMatch(rowData.id);
};

export interface Props {
	hackersData: QueriedHacker[];
	eventsData: QueriedEvent[];
}

const NfcTable: FC<Props> = ({ hackersData, eventsData }): JSX.Element => {
	const EventOptions: { label: string; value: string }[] = eventsData.map(event => {
		return {
			label: event.name,
			value: event.id,
		};
	});

	const table = useContext(TableContext);
	const { nfcValue, searchValue, sortBy, sortDirection } = table.state;

	const [sortedData, setSortedData] = useState(hackersData);
	const [topUserMatch, settopUserMatch] = useState('');
	const [manualMode, setManualMode] = useState(false);
	const [unadmitMode, setUnadmitMode] = useState(false);
	const [eventSelected, setEventSelected] = useState(eventsData[0]);
	const onRowClick = useCallback(() => generateOnRowClick(settopUserMatch), [settopUserMatch]);

	const searchBoxRef = React.useRef<HTMLInputElement>(null);

	const [registerNfcUidWithUser] = useRegisterNfcuidWithUserMutation();
	const [checkInUserToEvent] = useCheckInUserToEventMutation();
	const [removeUserFromEvent] = useRemoveUserFromEventMutation();
	const [checkInUserToEventByNfc] = useCheckInUserToEventByNfcMutation();
	const [removeUserFromEventByNfc] = useRemoveUserFromEventByNfcMutation();

	const handleSubmit = createSubmitHandler(
		registerNfcUidWithUser,
		checkInUserToEvent,
		removeUserFromEvent,
		checkInUserToEventByNfc,
		removeUserFromEventByNfc
	);

	useEffect(() => {
		// filter and sort data
		let newData = [...hackersData];

		if (searchValue.trim() !== '') {
			newData = new Fuse(newData, {
				keys: ['email', 'firstName', 'lastName', 'school'] as (keyof QueriedHacker)[],
				...fuseOpts,
			})
				.search(searchValue)
				.sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
				.slice(0, 5)
				.map(({ item }) => item);
		}

		// Sort data based on props and context
		if (sortBy && sortDirection) {
			newData.sort((a, b) =>
				sortDirection === SortDirection.DESC
					? collator.compare(`${b[sortBy]}`, `${a[sortBy]}`)
					: collator.compare(`${a[sortBy]}`, `${b[sortBy]}`)
			);
		}

		if (searchValue.trim() !== '') {
			if (newData.length) {
				settopUserMatch(newData[0].id);
			}
		} else {
			settopUserMatch('');
		}
		setSortedData(newData);
	}, [hackersData, sortBy, sortDirection, searchValue]);

	return eventsData.length === 0 ? (
		<SmallCenteredText color={DARK_TEXT_COLOR} fontSize="1rem" margin="0rem">
			{NO_EVENTS_MESSAGE}
		</SmallCenteredText>
	) : (
		<TableLayout>
			<TableOptions>
				<EventSelect
					width="100%"
					name="colors"
					defaultValue={[EventOptions[0]]}
					options={EventOptions}
					onChange={(option: { label: string; value: string }) => {
						const event = eventsData.find(ev => {
							return ev.id === option.value;
						});
						if (event) {
							setEventSelected(event);
						}
					}}
					className="basic-select"
					classNamePrefix="select"
				/>
				{manualMode || eventSelected.eventType === CHECK_IN_EVENT_TYPE ? (
					<SearchBox
						width="100%"
						value={searchValue}
						placeholder="Manual Search"
						onChange={onSearchBoxEntry(table)}
						ref={searchBoxRef}
						onKeyPress={async e => {
							if (manualMode && e.key === 'Enter') {
								await handleSubmit(nfcValue, topUserMatch, eventSelected, unadmitMode);
								table.update(draft => {
									draft.nfcValue = '';
									draft.searchValue = '';
								});
								if (searchBoxRef.current) searchBoxRef.current.focus();
							}
						}}
						minWidth="15rem"
						hasIcon
						flex
					/>
				) : null}
				{!manualMode || eventSelected.eventType === CHECK_IN_EVENT_TYPE ? (
					<SearchBox
						width="100%"
						value={nfcValue}
						placeholder="Scan NFC"
						onChange={onNfcBoxEntry(table)}
						onKeyPress={async e => {
							if (e.key === 'Enter') {
								await handleSubmit(nfcValue, topUserMatch, eventSelected, unadmitMode);
								table.update(draft => {
									draft.nfcValue = '';
									draft.searchValue = '';
								});
								if (searchBoxRef.current) searchBoxRef.current.focus();
							}
						}}
						minWidth="15rem"
						flex
					/>
				) : null}
				{eventSelected.eventType !== CHECK_IN_EVENT_TYPE ? (
					<ManualToggleWrapper>
						<ToggleSwitch
							label="Manual Mode: "
							checked={manualMode}
							onChange={() => {
								setManualMode(!manualMode);
							}}
						/>
					</ManualToggleWrapper>
				) : null}
				<UnadmitToggleWrapper>
					<ToggleSwitch
						label="Unadmit Mode: "
						checked={unadmitMode}
						onChange={() => {
							setUnadmitMode(!unadmitMode);
						}}
					/>
				</UnadmitToggleWrapper>
				<Button
					async
					onClick={() => {
						const promise = handleSubmit(nfcValue, topUserMatch, eventSelected, unadmitMode);
						table.update(draft => {
							draft.nfcValue = '';
							draft.searchValue = '';
						});
						if (searchBoxRef.current) searchBoxRef.current.focus();
						return promise;
					}}>
					Submit
				</Button>
			</TableOptions>
			{manualMode || eventSelected.eventType === CHECK_IN_EVENT_TYPE ? (
				<AutoSizer>
					{({ height, width }) => (
						<NfcTableRows
							width={width}
							height={height}
							sortedData={sortedData}
							onSortColumnChange={onSortColumnChange}
							generateRowClassName={generateRowClassName(sortedData, topUserMatch)}
							table={table}
							rowClickFn={onRowClick}
						/>
					)}
				</AutoSizer>
			) : null}
		</TableLayout>
	);
};

export default NfcTable;
