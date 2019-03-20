import React from 'react';
import HackerTable from './HackerTable';
import hackerData from '../../assets/hackerData.json';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';

const ManageHackers = (): JSX.Element => {
	// GraphQL query would go here
	const tableData = hackerData;
	// const tableData = JSON.parse(hackerData.toString(), (key, value) => {
	// 	return value;
	// });

	const GET_HACKERS = gql`
		query {
			getAllHackers {
				firstName
				lastName
				needsReimbursement
				email
				school
				gradYear
			}
		}
	`;

	return (
		<Query query={GET_HACKERS}>
			{({ loading, error, data }: any) => {
				if (loading) return <div>Loading...</div>;
				if (error) {
					console.log(error);
					return <div>Error :(</div>;
				}
				return (
					<>
						<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
							<HackerTable data={tableData} />
						</FloatingPopup>
					</>
				);
			}}
		</Query>
	);
};

export default ManageHackers;

// Copyright (c) 2019 Vanderbilt University
