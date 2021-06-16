import React, { FC } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useImmer } from 'use-immer';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { Spinner } from '../../components/Loading/Spinner';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import STRINGS from '../../assets/strings.json';
import { HACKATHON_START, HACKATHON_END } from '../../../common/constants';
import { HackerView } from './HackerView';
import HackerTable from './HackerTable';
import { defaultTableState, TableContext } from '../../contexts/TableContext';
import { useHackersQuery, useMeSponsorQuery } from '../../generated/graphql';
		
export const SponsorHackerView: FC = () => {
	const { loading, error, data } = useHackersQuery();
	const [tableState, updateTableState] = useImmer(defaultTableState);
	const sponsor = useMeSponsorQuery();
	const now = Date.now();
	const viewResumes =
		sponsor.data?.me?.__typename === 'Sponsor' &&
		((sponsor.data?.me?.company?.tier?.permissions?.includes(STRINGS.PERMISSIONS_RESUME_BEFORE) &&
		now < HACKATHON_START) || 
		(sponsor.data?.me?.company?.tier?.permissions?.includes(STRINGS.PERMISSIONS_RESUME_DURING) &&
		now > HACKATHON_START && now < HACKATHON_END) ||
		(sponsor.data?.me?.company?.tier?.permissions?.includes(STRINGS.PERMISSIONS_RESUME_AFTER) &&
		now > HACKATHON_END));

	if (sponsor.error) {
		console.error(sponsor.error);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	// TODO: Check permissions of current user's company against
	// `STRINGS.PERMISSIONS_HACKER_TABLE` and deny access to those without permissions.
	return (
		<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
			<TableContext.Provider value={{ state: tableState, update: updateTableState }}>
				<Switch>
					<Route path="/view/hackers/detail/:id" component={HackerView} />
					<Route
						path="/view/hackers"
						render={() => {
							if (loading || !data) return <Spinner />;
							if (error) {
								console.log(error);
								return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
							}
							return <HackerTable data={data.hackers} isSponsor viewResumes={viewResumes} />;
						}}
					/>
				</Switch>
			</TableContext.Provider>
		</FloatingPopup>
	);
};

export default SponsorHackerView;
