import React from 'react';
import HackerTable from './HackerTable';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { Spinner } from '../../components/Loading/Spinner';
import ErrorMessage from '../../components/Text/ErrorMessage';
import TextButton from '../../components/Buttons/TextButton';
import STRINGS from '../../assets/strings.json';
import { Link } from 'react-router-dom';

const ManageHackers = (): JSX.Element => {
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

	return (
		<Query query={GET_HACKERS}>
			{({ loading, error, data }: any) => {
				if (error) console.log(error);
				// console.log(data);
				return (
					<>
						<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
							{loading ? <Spinner /> : error ? Error : <HackerTable data={data.getAllHackers} />}
						</FloatingPopup>
					</>
				);
			}}
		</Query>
	);
};

export default ManageHackers;

// Copyright (c) 2019 Vanderbilt University
