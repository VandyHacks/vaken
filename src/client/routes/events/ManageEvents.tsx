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
import { useAddOrUpdateEventMutation, useEventsQuery } from '../../generated/graphql';
import { updateEventsHandler } from './helpers';
import { EventUpdate } from './ManageEventTypes';

const ManageEvents: FunctionComponent = (): JSX.Element => {
	const [output, setOutput] = useState('<>');
	const [allEvents, setAllEvents] = useState('<all events>');
	const [addOrUpdateEvent] = useAddOrUpdateEventMutation();
	// const { loading, error, data } = useEventsQuery();

	async function getEvents() {
		const res = await fetch('/api/manage/events/pull');
		const resData = await res.json();
		const eventsList = (await resData) as EventUpdate[];
		const updatedEvents = updateEventsHandler(eventsList, addOrUpdateEvent);
		setOutput(JSON.stringify(updatedEvents, null, '\t'));
		// setAllEvents(data.events);
	}

	return (
		<FloatingPopup>
			<ActionButton onClick={getEvents}>Pull from Calendar</ActionButton>
			<FloatingPopup>
				<h1>Updated Events</h1>
				<pre>{output}</pre>
			</FloatingPopup>
		</FloatingPopup>
	);
};

export default ManageEvents;
