import React from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import HackerTable from './HackerTable';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { Spinner } from '../../components/Loading/Spinner';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import STRINGS from '../../assets/strings.json';

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

const ManageHackers = (): JSX.Element => {
	return (
		<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
			<Query query={GET_HACKERS}>
				{({ loading, error, data }: any): JSX.Element => {
					if (loading) {
						return <Spinner />;
					}

					if (error) {
						return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
					}

					return <HackerTable data={data.getAllHackers} />;
				}}
			</Query>
		</FloatingPopup>
	);
};

export default ManageHackers;

// Copyright (c) 2019 Vanderbilt University
