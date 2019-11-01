import React, { FunctionComponent, useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import { useImmer } from 'use-immer';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import Spinner from '../../components/Loading/Spinner';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import STRINGS from '../../assets/strings.json';
import { HackerView } from './HackerView';
import HackerTable from './HackerTable';
import { defaultTableState, TableContext } from '../../contexts/TableContext';
import { useHackersQuery, useMeSponsorQuery, Sponsor } from '../../generated/graphql';

export const SponsorHackerView: FunctionComponent = (): JSX.Element => {
	const { loading, error, data } = useHackersQuery();
	const [tableState, updateTableState] = useImmer(defaultTableState);
	const [filteredData, setFilteredData] = useState();
	const sponsorMeQueryResult = useMeSponsorQuery();
	const sponsorLoading = sponsorMeQueryResult.loading;
	const sponsorError = sponsorMeQueryResult.error;
	let sponsorData: Sponsor;
	let viewHackerTable = true;
	let viewResumes = true;

	if (!sponsorLoading && sponsorMeQueryResult.data && sponsorMeQueryResult.data.me) {
		sponsorData = sponsorMeQueryResult.data.me as Sponsor;

		if (
			!sponsorLoading &&
			sponsorData &&
			sponsorData.company &&
			sponsorData.company.tier &&
			sponsorData.company.tier.permissions
		) {
			viewHackerTable = sponsorData.company.tier.permissions.includes(
				STRINGS.PERMISSIONS_HACKER_TABLE
			);
			viewResumes = sponsorData.company.tier.permissions.includes(STRINGS.PERMISSIONS_RESUME);
		}
	}

	useEffect(() => {
		setFilteredData(data);
	}, [data]);

	if (sponsorError) {
		console.log(sponsorError);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	if (!sponsorLoading && !viewHackerTable) {
		return <p>You dont have permissions to view hacker information</p>;
	}

	return (
		<>
			<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
				<TableContext.Provider value={{ state: tableState, update: updateTableState }}>
					<Switch>
						<Route path="/view/hackers/detail/:id" component={HackerView} />
						<Route
							path="/view/hackers"
							render={() => {
								if (loading || !data || !filteredData) return <Spinner />;
								if (error) {
									console.log(error);
									return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
								}
								return (
									<HackerTable
										data={filteredData.hackers}
										isSponsor={true}
										viewResumes={viewResumes}
									/>
								);
							}}
						/>
					</Switch>
				</TableContext.Provider>
			</FloatingPopup>
		</>
	);
};

export default SponsorHackerView;
