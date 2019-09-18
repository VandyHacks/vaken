import React, { FunctionComponent, useState } from 'react';
import Select from 'react-select';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { SearchBox } from '../../components/Input/SearchBox';
import { ToggleSwitch } from '../../components/Buttons/ToggleSwitch';
// import { updateExpression } from '@babel/types';

const EventSelect = styled(Select)``;

// TODO(timliang/kenny): Connect this to events data
const EventOptions: { label: string; value: number }[] = [
	{ label: 'Hackathon Check-in', value: 0 },
	{ label: 'PlaceholderEvent1', value: 1 },
	{ label: 'PlaceholderEvent2', value: 2 },
];

const [manualMode, setManualMode] = useState(0);

export const Nfc: FunctionComponent = (): JSX.Element => {
	return (
		<div>
			<EventSelect
				name="colors"
				defaultValue={[EventOptions[0]]}
				// value=
				options={EventOptions}
				className="basic-multi-select"
				classNamePrefix="select"
			/>
			<SearchBox
				width="100%"
				// value={searchValue}
				placeholder="Scan NFC"
				// onChange={onSearchBoxEntry(table)}
				minWidth="15rem"
				// hasIcon
				flex
			/>
			<SearchBox
				width="100%"
				// value={searchValue}
				placeholder="Manual Search"
				// onChange={onSearchBoxEntry(table)}
				minWidth="15rem"
				hasIcon
				flex
			/>
			<ToggleSwitch
				label="Manual Mode: "
				checked={manualMode % 2 === 0}
				onChange={() => {
					setManualMode(manualMode + 1);
				}}
			/>
			<ToggleSwitch
				label="Unadmit Mode: "
				checked={false}
				onChange={() => {
					// unadmitMode = !unadmitMode;
				}}
			/>
		</div>
	);
};

export default Nfc;
