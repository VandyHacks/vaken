import React, { FunctionComponent, useState } from 'react';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { ActionButton } from '../../components/Buttons/ActionButton';
import { useAddOrUpdateEventMutation } from '../../generated/graphql';
import { updateEventsHandler } from './helpers';
import { EventUpdate } from './ManageEventTypes';

const ManageEvents: FunctionComponent = (): JSX.Element => {
	const [output, setOutput] = useState('<>');
	// const [allEvents, setAllEvents] = useState('<all events>');
	const [addOrUpdateEvent] = useAddOrUpdateEventMutation();
	// const { loading, error, data } = useEventsQuery();

	async function getEvents(): Promise<void> {
		const res = await fetch('/api/manage/events/pull');
		const resData = await res.json();
		const eventsList = resData as EventUpdate[];
		const updatedEvents = updateEventsHandler(eventsList, addOrUpdateEvent);
		setOutput(JSON.stringify(updatedEvents, null, '\t'));
		// setAllEvents(data.events);
		// Place holder for events table showing all events, and some UI component listing events just pulled
		// TODO: Add events table and said UI component or just table, with columns being event attributes + time added
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
