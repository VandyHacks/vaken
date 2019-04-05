import React, { FunctionComponent, useState } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { useQuery } from 'react-apollo-hooks';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { Spinner } from '../../components/Loading/Spinner';
import { ErrorMessage } from '../../components/Text/ErrorMessage';
import TextButton from '../../components/Buttons/TextButton';
import STRINGS from '../../assets/strings.json';
import { Route, Switch, Link } from 'react-router-dom';
import HackerView from './HackerView';
import HackerTable from './HackerTable';
import { Table, TableContext } from '../../contexts/TableContext';

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

interface Props { }

export const ManageHackers: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const [table, setTable] = useState(new Table([]));

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

	return (
		<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
			<Switch>
				<Route path="/manageHackers/hacker" component={HackerView} />
				<Route
					path="/manageHackers"
					render={() => (
						<Query query={GET_HACKERS}>
							{({ loading, error, data }: any) => {
								if (error) console.log(error);
								if (data) {
									console.log('reloading data');
									// setTable(table => ({...table, sortedData: data, unsortedData: data}));
								}
								console.log(data);
								return (
									<>
										{loading ? (
											<Spinner />
										) : error ? (
											Error
										) : (
													<TableContext.Provider value={table}>
														<HackerTable data={data.getAllHackers} />
													</TableContext.Provider>
												)}
									</>
								);
							}}
						</Query>
					)}
				/>
			</Switch>
		</FloatingPopup>
	);
};

export default ManageHackers;

// Copyright (c) 2019 Vanderbilt University
