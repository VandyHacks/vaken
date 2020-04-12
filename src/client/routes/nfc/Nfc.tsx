import React, { FunctionComponent } from 'react';
import { useImmer } from 'use-immer';
import NfcTable from './NfcTable';
import STRINGS from '../../assets/strings.json';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import Spinner from '../../components/Loading/Spinner';
import { defaultTableState, TableContext } from '../../contexts/TableContext';
import {
	useEventsQuery,
	useHackersQuery,
	useMeSponsorQuery,
	Sponsor,
} from '../../generated/graphql';

export const Nfc: FunctionComponent = (): JSX.Element => {
	const hackers = useHackersQuery();
	const hackersLoading = hackers.loading;
	const hackersError = hackers.error;
	const hackersData = hackers.data;

	const events = useEventsQuery();
	const eventsLoading = events.loading;
	const eventsError = events.error;
	const eventsData = events.data;

	const sponsorMeQueryResult = useMeSponsorQuery();
	const sponsorLoading = sponsorMeQueryResult.loading;
	const sponsorError = sponsorMeQueryResult.error;
	let sponsorData: Sponsor;
	let viewNfc = false;
	let isSponsor = false;

	if (!sponsorLoading && sponsorMeQueryResult.data && sponsorMeQueryResult.data.me) {
		sponsorData = sponsorMeQueryResult.data.me as Sponsor;

		if (
			sponsorData.userType === 'SPONSOR' &&
			sponsorData.company &&
			sponsorData.company.tier &&
			sponsorData.company.tier.permissions
		) {
			isSponsor = true;
			viewNfc = sponsorData.company.tier.permissions.includes(STRINGS.PERMISSIONS_NFC);
		}
	}

	const [tableState, updateTableState] = useImmer(defaultTableState);

	if (hackersLoading || !hackersData || eventsLoading || sponsorLoading || !eventsData) {
		return <Spinner />;
	}
	if (hackersError) {
		console.log(hackersError);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}
	if (eventsError) {
		console.log(eventsError);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	const now = Date.now();
	const eventsCurrent = eventsData.events.filter(e => {
		const TIME_BUFFER = 60; // 60 minutes
		const delta = (now - e.startTimestamp) / (1000 * 60); // Time diff in minutes
		return delta >= -1 * TIME_BUFFER && delta <= e.duration + TIME_BUFFER;
	});

	if (isSponsor && sponsorError) {
		console.log(sponsorError);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	if (isSponsor && !viewNfc) {
		return <p>You dont have permissions to scan NFCs</p>;
	}

	return (
		<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
			<TableContext.Provider value={{ state: tableState, update: updateTableState }}>
				<NfcTable hackersData={hackersData.hackers} eventsData={eventsCurrent} />
			</TableContext.Provider>
		</FloatingPopup>
	);
};

export default Nfc;
