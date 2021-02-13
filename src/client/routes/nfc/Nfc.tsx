import React, { FunctionComponent } from 'react';
import { useImmer } from 'use-immer';
import NfcTable from './NfcTable';
import STRINGS from '../../assets/strings.json';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { Spinner } from '../../components/Loading/Spinner';
import { defaultTableState, TableContext } from '../../contexts/TableContext';
import { useEventsQuery, useHackersQuery, useMeSponsorQuery } from '../../generated/graphql';

export const Nfc: FunctionComponent = (): JSX.Element => {
	const [tableState, updateTableState] = useImmer(defaultTableState);
	const hackers = useHackersQuery();
	const events = useEventsQuery();
	const loggedInUser = useMeSponsorQuery();
	if (loggedInUser.loading) return <Spinner />;

	const isSponsor = loggedInUser.data?.me?.__typename === 'Sponsor';
	const viewNfc =
		loggedInUser.data?.me?.__typename === 'Sponsor' &&
		loggedInUser.data?.me?.company?.tier?.permissions?.includes(STRINGS.PERMISSIONS_NFC);

	if (hackers.error || (!hackers.loading && !hackers.data)) {
		console.error(hackers.error ?? 'No error was reported, but no data received either.');
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}
	if (events.error || (!events.loading && !events.data)) {
		console.error(events.error ?? 'No error was reported, but no data received either.');
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	const now = Date.now();
	const ongoingEvents = events.data?.events.filter(e => {
		const TIME_BUFFER = 60; // 60 minutes
		const delta = (now - e.startTimestamp) / (1000 * 60); // Time diff in minutes
		return delta >= -1 * TIME_BUFFER && delta <= e.duration + TIME_BUFFER;
	});

	if (isSponsor && !viewNfc) {
		return <p>You dont have permissions to scan NFCs</p>;
	}

	return (
		<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
			<TableContext.Provider value={{ state: tableState, update: updateTableState }}>
				<NfcTable hackersData={hackers.data?.hackers ?? []} eventsData={ongoingEvents ?? []} />
			</TableContext.Provider>
		</FloatingPopup>
	);
};

export default Nfc;
