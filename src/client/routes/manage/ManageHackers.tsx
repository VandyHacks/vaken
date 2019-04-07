import React, { FunctionComponent, useState } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { useQuery } from 'react-apollo-hooks';
import { Route, Switch, Link } from 'react-router-dom';
import { SortDirectionType } from 'react-virtualized';
import { useImmer } from 'use-immer';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { Spinner } from '../../components/Loading/Spinner';
import { ErrorMessage } from '../../components/Text/ErrorMessage';
import TextButton from '../../components/Buttons/TextButton';
import STRINGS from '../../assets/strings.json';
import HackerView from './HackerView';
import HackerTable from './HackerTable';
import {
	defaultTableState,
	TableState,
	columnOptions,
	Option,
	TableContext,
} from '../../contexts/TableContext';

const GET_HACKERS = gql`
	query {
		getAllHackers {
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

const Error = (
	<ErrorMessage>
		<>
			<p>There was a problem.</p>
			<p>Please contact your dev team.</p>
			<Link style={{ textDecoration: 'none' }} to="/dashboard">
				<TextButton text="Return to Dashboard" background={STRINGS.WARNING_COLOR} color="white" />
			</Link>
		</>
	</ErrorMessage>
);

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
						render={() => (
							<>
								{loading ? <Spinner /> : error ? Error : <HackerTable data={data.getAllHackers} />}
							</>
						)}
					/>
				</Switch>
			</TableContext.Provider>
		</FloatingPopup>
	);
};

export default ManageHackers;

// Copyright (c) 2019 Vanderbilt University
