import React, { FunctionComponent, useState, useEffect } from 'react';
import Select from 'react-select';
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

export const SponsorHackerView: FunctionComponent = (): JSX.Element => {
	const { loading, error, data } = useHackersQuery();
	const [tableState, updateTableState] = useImmer(defaultTableState);
	const [eventIds, setEventIds] = useState([] as string[]);
	const [filteredData, setFilteredData] = useState();

	useEffect(() => {
		setFilteredData(data);
	}, [data]);

	useEffect(() => {
		if (loading || !data) return;
		const tmpData: { hackers: Partial<Hacker>[] } = { hackers: [...data.hackers] };

		if (tmpData && tmpData.hackers) {
			if (eventIds && eventIds.length > 0) {
				tmpData.hackers = tmpData.hackers.filter(
					(hacker: Partial<Hacker>) =>
						hacker &&
						hacker.eventsAttended &&
						hacker.eventsAttended.some(eventId => eventIds.includes(eventId))
				);
			}
			setFilteredData(tmpData);
		}
	}, [data, eventIds, loading]);

	const { data: eventData, loading: eventLoading, error: eventError } = useEventsQuery();
	if (eventError) console.error(eventError);

	let options: Record<string, string>[] = [];
	if (eventData && eventData.events) {
		options = eventData.events.map(e => ({ label: e.name, value: e.id.toString() }));
	}

	const customStyles = {
		option: (provided: any) => ({
			...provided,
			padding: 20,
			backgroundColor: 'white',
		}),
		control: () => ({
			// none of react-select's styles are passed to <Control />
			width: 200,
		}),
	};

	return (
		<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
			<TableContext.Provider value={{ state: tableState, update: updateTableState }}>
				{!eventLoading && (
					<Select
						isMulti
						styles={customStyles}
						options={options}
						onChange={selected => {
							if (!selected) setEventIds([]);
							else
								setEventIds(
									(selected as Record<string, string>[]).map((s: Record<string, string>) => s.value)
								);
						}}
					/>
				)}
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
						}}
					/>
				</Switch>
			</TableContext.Provider>
		</FloatingPopup>
	);
};

export default SponsorHackerView;
