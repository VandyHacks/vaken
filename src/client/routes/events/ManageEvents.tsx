import React, { FunctionComponent, useState } from 'react';

import styled from 'styled-components';
import Select from 'react-select';
import STRINGS from '../../assets/strings.json';

import FloatingPopup from '../../components/Containers/FloatingPopup';
import { ActionButton } from '../../components/Buttons/ActionButton';
import Spinner from '../../components/Loading/Spinner';
import { Title } from '../../components/Text/Title';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import {
	useAssignEventToCompanyMutation,
	useAddOrUpdateEventMutation,
	useEventsQuery,
	useCompaniesQuery,
} from '../../generated/graphql';
import { updateEventsHandler, assignEventHandler } from './helpers';
import { EventUpdate } from './ManageEventTypes';

const SponsorSelect = styled(Select)`
	min-width: 15rem;
	width: 100%;
	display: inline-block;
	font-size: 1rem;
	margin-right: 1rem;
`;

const ManageEvents: FunctionComponent = (): JSX.Element => {
	const [output, setOutput] = useState('<>');
	// const [allEvents, setAllEvents] = useState('<all events>');
	const [addOrUpdateEvent] = useAddOrUpdateEventMutation();
	const [assignEventToCompany] = useAssignEventToCompanyMutation();
	// const { loading, error, data } = useEventsQuery();

	const eventsQuery = useEventsQuery();
	const eventsLoading = eventsQuery.loading;
	const eventsError = eventsQuery.error;
	const eventsData = eventsQuery.data;

	const companiesQuery = useCompaniesQuery();
	const companiesLoading = companiesQuery.loading;
	const companiesError = companiesQuery.error;
	const companiesData = companiesQuery.data;

	if (companiesLoading || !companiesData || eventsLoading || !eventsData) {
		return <Spinner />;
	}

	if (companiesError) {
		console.log(companiesError);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	if (eventsError) {
		console.log(eventsError);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	const eventRows = eventsData.events.map(e => {
		return {
			id: e.id,
			name: e.name,
			eventType: e.eventType,
			startTimestamp: new Date(e.startTimestamp).toDateString(),
			owner: e.owner,
		};
	});

	const companyOptions: { label: string; value: string }[] = companiesData.companies.map(c => {
		return {
			label: c.name,
			value: c.id,
		};
	});

	async function pullCalendarEvents(): Promise<void> {
		// TODO(#473): Use graphql for this fetch to take advantage of
		// Apollo caching
		const res = await fetch('/api/manage/events/pull');
		const resData = await res.json();
		const eventsList = resData as EventUpdate[];
		const updatedEvents = await updateEventsHandler(eventsList, addOrUpdateEvent);
		setOutput(JSON.stringify(updatedEvents, null, '\t'));
		// setAllEvents(data.events);
		// Place holder for events table showing all events, and some UI component listing events just pulled
		// TODO: Add events table and said UI component or just table, with columns being event attributes + time added
	}

	function assignSponsorEvent(eventID: string, companyID: string): void {
		assignEventHandler(eventID, companyID, assignEventToCompany);
	}

	return (
		<FloatingPopup>
			<ActionButton onClick={pullCalendarEvents}>Pull from Calendar</ActionButton>
			<FloatingPopup>
				<Title>Updated Events</Title>
				<pre>{output}</pre>
			</FloatingPopup>

			<FloatingPopup>
				<Title>Events and Sponsors</Title>
				{eventRows.map(row => (
					<div key={row.id}>
						<p>{row.name}</p>
						<p>{row.startTimestamp}</p>
						<br />
						<SponsorSelect
							defaultValue={companyOptions.find(c => {
								if (!row.owner) return null;
								return c.value === row.owner.id;
							})}
							options={companyOptions}
							onChange={(option: { label: string; value: string }) => {
								assignSponsorEvent(row.id, option.value);
							}}
						/>
					</div>
				))}
			</FloatingPopup>
		</FloatingPopup>
	);
};

export default ManageEvents;
