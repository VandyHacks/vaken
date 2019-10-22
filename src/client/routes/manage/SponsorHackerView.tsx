import React, { FunctionComponent, useState, useEffect } from 'react';
import { Route, Switch } from 'react-router-dom';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import Spinner from '../../components/Loading/Spinner';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import STRINGS from '../../assets/strings.json';
import { HackerView } from './HackerView';
import HackerTable from './HackerTable';
import { defaultTableState, TableContext } from '../../contexts/TableContext';
import { useHackersQuery, useEventsQuery, HackersQuery, Hacker } from '../../generated/graphql';

const StyledSelect = styled.select`
	margin: 0.25rem 1rem 0.25rem 0rem;
	padding: 0.75rem;
	box-shadow: 0rem 0.5rem 4rem rgba(0, 0, 0, 0.07);
	border-radius: 0.375rem;
	font-size: 1rem;
	box-sizing: border-box;
	border: 0.0625rem solid '#ecebed';
	min-width: 10rem;
`;

const StyledOption = styled.option`
	margin: 0.25rem 1rem 0.25rem 0rem;
	padding: 0.75rem;
	box-shadow: 0rem 0.5rem 4rem rgba(0, 0, 0, 0.07);
	border-radius: 0.375rem;
	font-size: 1rem;
	box-sizing: border-box;
	border: 0.0625rem solid '#ecebed';
	min-width: 10rem;
`;

export const SponsorHackerView: FunctionComponent = (): JSX.Element => {
	const { loading, error, data } = useHackersQuery();
	const [tableState, updateTableState] = useImmer(defaultTableState);
	const [eventId, setEventId] = useState('');
	const [filteredData, setFilteredData] = useState();

	useEffect(() => {
		setFilteredData(data);
	}, [data]);

	useEffect(() => {
		let tmpData = Object.create(data || {});
		if (tmpData && tmpData.hackers) {
			if (eventId) {
				tmpData.hackers = tmpData.hackers.filter((hacker: Hacker) => hacker.eventsAttended.includes(eventId));
			}
			setFilteredData(tmpData);
		}
	}, [eventId]);

	const getEventData = () => {
		const { loading: eventLoading, error: eventError, data: eventData } = useEventsQuery();
		if (eventError) console.error(eventError);
		return ({ eventData, eventLoading });
	};
	const { eventData, eventLoading } = getEventData();

	return (
		<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
			<TableContext.Provider value={{ state: tableState, update: updateTableState }}>
				{!eventLoading &&
					(
						<StyledSelect onChange={e => setEventId(e.target.value)} >
							<StyledOption value="" disabled>
								Select Event to Filter By
							</StyledOption>
							<StyledOption value="">
								No filter
							</StyledOption>
							{
								eventData && eventData.events && eventData.events.map(e => (
									<StyledOption key={e.id} value={e.id.toString()}>
										{e.name}
									</StyledOption>
								))
							}
						</StyledSelect>
					)
				}
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
							return <HackerTable data={filteredData.hackers} />;
							g
						}}
					/>
				</Switch>
			</TableContext.Provider>
		</FloatingPopup >
	);
};

export default SponsorHackerView;
