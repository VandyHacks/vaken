import React, { FunctionComponent, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { SearchBox } from '../../components/Input/SearchBox';
import { ToggleSwitch } from '../../components/Buttons/ToggleSwitch';
import { HeaderButton } from '../../components/Buttons/HeaderButton';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { useEventsNamesQuery } from '../../generated/graphql';
import Spinner from '../../components/Loading/Spinner';

const EventSelect = styled.select`
	width: 50%;
`;

const StyledOption = styled.option`
	width: 50%;
`;

const CHECK_IN_VALUE = 'check_in'; // TODO

export const Nfc: FunctionComponent = (): JSX.Element => {
	const [manualMode, setManualMode] = useState(false);
	const [unadmitMode, setUnadmitMode] = useState(false);
	const [eventSelected, setEventSelected] = useState(CHECK_IN_VALUE);
	const { data, loading, error } = useEventsNamesQuery();

	const EventOptionsPlaceholder: { label: string; value: string }[] = [
		{ label: 'Hackathon Check-in', value: CHECK_IN_VALUE },
		{ label: 'PlaceholderEvent1', value: 'test_1' },
		{ label: 'PlaceholderEvent2', value: 'test_2' },
	];

	return (
		<FloatingPopup>
			{loading || !data ? (
				<Spinner />
			) : (
				<EventSelect onChange={e => setEventSelected(e.target.value)}>
					<StyledOption value="" disabled selected>
						Select Event
					</StyledOption>
					{data.events.map(e => (
						<StyledOption key={e.id} value={e.id.toString()}>
							{e.name}
						</StyledOption>
					))}
				</EventSelect>
			)}

			{!manualMode || eventSelected === CHECK_IN_VALUE ? (
				<SearchBox
					width="100%"
					// value={searchValue} // TODO
					placeholder="Scan NFC"
					// onChange={onSearchBoxEntry(table)} // TODO
					minWidth="15rem"
					flex
				/>
			) : null}
			{manualMode || eventSelected === CHECK_IN_VALUE ? (
				<SearchBox
					width="100%"
					// value={searchValue} // TODO
					placeholder="Manual Search"
					// onChange={onSearchBoxEntry(table)} // TODO
					minWidth="15rem"
					hasIcon
					flex
				/>
			) : null}
			{eventSelected !== CHECK_IN_VALUE ? (
				<ToggleSwitch
					label="Manual Mode: "
					checked={manualMode}
					onChange={() => {
						setManualMode(!manualMode);
					}}
				/>
			) : null}
			<ToggleSwitch
				label="Unadmit Mode: "
				checked={unadmitMode}
				onChange={() => {
					setUnadmitMode(!unadmitMode);
				}}
			/>
			<HeaderButton onClick={() => {}}>Submit</HeaderButton>
		</FloatingPopup>
	);
};

export default Nfc;
