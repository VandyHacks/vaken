import React, { FunctionComponent, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useImmer } from 'use-immer';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import Spinner from '../../components/Loading/Spinner';
import { Button } from '../../components/Buttons/Buttons';
import ActionButton from '../../components/Buttons/ActionButton';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import STRINGS from '../../assets/strings.json';
import { defaultTableState, TableContext } from '../../contexts/TableContext';

const ManageEvents: FunctionComponent = (): JSX.Element => {
	const [output, setOutput] = useState('sdfsdf');

	async function getEvents() {
		const res = await fetch('/api/manage/events');
		const resObj = await res.json();
		console.log(resObj);
		setOutput(JSON.stringify(resObj));
	}
	return (
		<FloatingPopup>
			<ActionButton onClick={getEvents}>Sync</ActionButton>
			<FloatingPopup>{output}</FloatingPopup>
		</FloatingPopup>
	);
};

export default ManageEvents;
