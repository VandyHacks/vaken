import React, { useContext, useState, useEffect, FC } from 'react';
import { AutoSizer, SortDirection } from 'react-virtualized';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import Select from 'react-select';
import Fuse from 'fuse.js';
import { HeaderButton } from '../../components/Buttons/HeaderButton';
import {
	generateRowClassName,
	createMatchCriteria,
	createSubmitHandler,
	CHECK_IN_EVENT_TYPE,
} from './helpers';

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

import STRINGS from '../../assets/strings.json';
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

const TableData = styled('div')`
	flex: 1 1 auto;
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

interface NfcTableProps {
	hackersData: QueriedHacker[];
	eventsData: QueriedEvent[];
}

const NfcTable: FC<NfcTableProps> = ({ hackersData, eventsData }: NfcTableProps): JSX.Element => {
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
				.slice(0, 5);
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
		<SmallCenteredText color={STRINGS.DARK_TEXT_COLOR} fontSize="1rem" margin="0rem">
			{STRINGS.NO_EVENTS_MESSAGE}
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
						onKeyPress={e => {
							if (manualMode && e.key === 'Enter') {
								const success = handleSubmit(nfcValue, topUserMatch, eventSelected, unadmitMode);
								if (success) {
									table.update(draft => {
										draft.nfcValue = '';
										draft.searchValue = '';
									});
								}
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
						onKeyPress={e => {
							if (e.key === 'Enter') {
								const success = handleSubmit(nfcValue, topUserMatch, eventSelected, unadmitMode);
								if (success) {
									table.update(draft => {
										draft.nfcValue = '';
										draft.searchValue = '';
									});
								}
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
				<HeaderButton
					onClick={() => {
						const success = handleSubmit(nfcValue, topUserMatch, eventSelected, unadmitMode);
						if (success) {
							table.update(draft => {
								draft.nfcValue = '';
								draft.searchValue = '';
							});
						}
					}}>
					Submit
				</HeaderButton>
			</TableOptions>
			<TableData>
				{manualMode || eventSelected.eventType === CHECK_IN_EVENT_TYPE ? (
					<AutoSizer>
						{({ height, width }) => (
							<NfcTableRows
								width={width}
								height={height}
								sortedData={sortedData}
								onSortColumnChange={onSortColumnChange}
								generateRowClassName={generateRowClassName}
								table={table}
							/>
						)}
					</AutoSizer>
				) : null}
			</TableData>
		</TableLayout>
	);
};

export default NfcTable;
