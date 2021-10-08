import React, { FunctionComponent, useState, useCallback, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { Button } from '../../components/Buttons/Button';
import STRINGS from '../../assets/strings.json';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { Spinner } from '../../components/Loading/Spinner';
import { Collapsible } from '../../components/Containers/Collapsible';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import { FlexColumn, FlexRow } from '../../components/Containers/FlexContainers';
import { ActionButtonContext } from '../../contexts/ActionButtonContext';
import {
	useAssignEventToCompanyMutation,
	useAddOrUpdateEventMutation,
	useRemoveAbsentEventsMutation,
	useEventsQuery,
	useCompaniesQuery,
} from '../../generated/graphql';
import { updateEventsHandler, assignEventHandler } from './helpers';
import { EventUpdate } from './ManageEventTypes';

const timeFormatter = Intl.DateTimeFormat([], {
	weekday: 'long',
	month: 'short',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
});

const SponsorSelect = styled(Select)`
	min-width: 15rem;
	width: 100%;
	display: inline-block;
	font-size: 1rem;
	margin-right: 1rem;
`;

const ManageEvents: FunctionComponent = (): JSX.Element => {
	const [output, setOutput] = useState('No updates to report');
	const [addOrUpdateEvent] = useAddOrUpdateEventMutation();
	const [removeAbsentEvents] = useRemoveAbsentEventsMutation();
	const [assignEventToCompany] = useAssignEventToCompanyMutation();
	const { update: setActionButton } = useContext(ActionButtonContext);
	const events = useEventsQuery();
	const companies = useCompaniesQuery();
	const [updatedEventsOpen, setupdatedEventsOpen] = useState(false);
	const [eventsAndSponsorsOpen, setEventsAndSponsorsOpen] = useState(true);

	const pullCalendarEvents = useCallback(async (): Promise<void> => {
		// TODO(#473): Use graphql for this fetch to take advantage of
		// Apollo caching
		const eventsList = (await fetch('/api/manage/events/pull').then(res =>
			res.json()
		)) as EventUpdate[];
		const updatedEvents = await updateEventsHandler(
			eventsList,
			addOrUpdateEvent,
			removeAbsentEvents
		);
		setOutput(JSON.stringify(updatedEvents, null, '\t'));
		setupdatedEventsOpen(true);
		// setAllEvents(data.events);
		// Place holder for events table showing all events, and some UI component listing events just pulled
		// TODO: Add events table and said UI component or just table, with columns being event attributes + time added
	}, [addOrUpdateEvent, removeAbsentEvents]);

	const assignSponsorEvent = useCallback(
		(eventID: string, companyID: string): Promise<void> =>
			assignEventHandler(eventID, companyID, assignEventToCompany),
		[assignEventToCompany]
	);

	useEffect((): (() => void) => {
		if (setActionButton) {
			setActionButton(
				<Button async warning onClick={pullCalendarEvents}>
					Pull from Calendar
				</Button>
			);
		}
		return () => {
			if (setActionButton) setActionButton(undefined);
		};
	}, [setActionButton, pullCalendarEvents]);

	if (companies.loading || events.loading) {
		return <Spinner />;
	}

	if (events.error || companies.error || !companies.data || !events.data) {
		console.error(events.error ?? companies.error);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	const eventRows = [...events.data.events];
	eventRows.sort((a, b) => a.startTimestamp - b.startTimestamp);

	const companyOptions = companies.data.companies.map(({ name, id }) => ({
		label: name,
		value: id,
	}));

	return (
		<FloatingPopup>
			<Collapsible
				title="Updated Events"
				open={updatedEventsOpen}
				onClick={() => setupdatedEventsOpen(!updatedEventsOpen)}>
				<pre>{output}</pre>
			</Collapsible>
			<br />
			<Collapsible
				title="Events and Sponsors"
				open={eventsAndSponsorsOpen}
				onClick={() => setEventsAndSponsorsOpen(!eventsAndSponsorsOpen)}>
				{eventRows.map(event => (
					<FlexRow key={event.id}>
						<FlexColumn>
							<p>
								<a href={`${window.location.protocol}{window.location.hostname}/checkin/${event.id}`}>Check-In URL</a>
							</p>
						</FlexColumn>
						<FlexColumn>
							<p>{event.name}</p>
							<p>{timeFormatter.format(new Date(event.startTimestamp))}</p>
							<br />
						</FlexColumn>
						<FlexColumn>
							<SponsorSelect
								defaultValue={companyOptions.find(c => {
									if (!event.owner) return null;
									return c.value === event.owner.id;
								})}
								options={companyOptions}
								onChange={(sponsor: typeof companyOptions[number]) => {
									assignSponsorEvent(event.id, sponsor.value);
								}}
							/>
						</FlexColumn>
					</FlexRow>
				))}
			</Collapsible>
		</FloatingPopup>
	);
};

export default ManageEvents;
