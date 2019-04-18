import React, { FunctionComponent } from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import { Route, Switch } from 'react-router-dom';
import { useImmer } from 'use-immer';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { Spinner } from '../../components/Loading/Spinner';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import STRINGS from '../../assets/strings.json';
import HackerView from './HackerView';
import HackerTable from './HackerTable';
import { defaultTableState, TableState, TableContext } from '../../contexts/TableContext';

export const GET_HACKERS = gql`
	query {
		hackers {
			firstName
			lastName
			email
			gradYear
			school
			status
			needsReimbursement
		}
	}
`;

export const ManageHackers: FunctionComponent = (): JSX.Element => {
	const { loading, error, data } = useQuery(GET_HACKERS);
	const [tableState, updateTableState] = useImmer<TableState>(defaultTableState);

	return (
		<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
			<TableContext.Provider value={{ state: tableState, update: updateTableState }}>
				<Switch>
					<Route path="/manageHackers/hacker" component={HackerView} />
					<Route
						path="/manageHackers"
						render={() => {
							if (loading) return <Spinner />;
							if (error) {
								console.log(error);
								return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
							}
							return <HackerTable data={data.hackers} />;
						}}
					/>
				</Switch>
			</TableContext.Provider>
		</FloatingPopup>
	);
};

export default ManageHackers;

// Copyright (c) 2019 Vanderbilt University
