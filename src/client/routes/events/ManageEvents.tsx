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
import { useAddOrUpdateEventMutation } from '../../generated/graphql';
import { updateEventsHandler } from './helpers';
import { EventUpdate } from './ManageEventTypes';

const ManageEvents: FunctionComponent = (): JSX.Element => {
	const [output, setOutput] = useState('sdfsdf');
	const [addOrUpdateEvent] = useAddOrUpdateEventMutation();

	async function getEvents() {
		const res = await fetch('/api/manage/events/pull');
		const data = await res.json();
		const eventsList = (await data) as EventUpdate[];
		const updatedEvents = updateEventsHandler(eventsList, addOrUpdateEvent);
		setOutput(JSON.stringify(updatedEvents, null, '\t'));
	}
	return (
		<FloatingPopup>
			<ActionButton onClick={getEvents}>Pull from Calendar</ActionButton>
			<FloatingPopup>
				<pre>{output}</pre>
			</FloatingPopup>
		</FloatingPopup>
	);
};

export default ManageEvents;
