import React, { FunctionComponent, useState } from 'react';
import Select from 'react-select';
import styled from 'styled-components';
import { SearchBox } from '../../components/Input/SearchBox';
import { ToggleSwitch } from '../../components/Buttons/ToggleSwitch';
import { HeaderButton } from '../../components/Buttons/HeaderButton';
import FloatingPopup from '../../components/Containers/FloatingPopup';

const EventSelect = styled(Select)``;
const CHECK_IN_VALUE = 'check_in'; // TODO

// TODO(timliang/kenny): Connect this to events data
const EventOptions: { label: string; value: string }[] = [
	{ label: 'Hackathon Check-in', value: CHECK_IN_VALUE },
	{ label: 'PlaceholderEvent1', value: 'test_1' },
	{ label: 'PlaceholderEvent2', value: 'test_2' },
];

export const Nfc: FunctionComponent = (): JSX.Element => {
	const [manualMode, setManualMode] = useState(false);
	const [unadmitMode, setUnadmitMode] = useState(false);
	const [eventSelected, setEventSelected] = useState(CHECK_IN_VALUE);
	return (
		<FloatingPopup>
			<EventSelect
				name="colors"
				defaultValue={[EventOptions[0]]}
				options={EventOptions}
				onChange={(option: { label: string; value: string }) => {
					setEventSelected(option.value);
				}}
				className="basic-select"
				classNamePrefix="select"
			/>
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
