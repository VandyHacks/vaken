import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import Spinner from '../../components/Loading/Spinner';
import STRINGS from '../../assets/strings.json';
import { FlexStartColumn } from '../../components/Containers/FlexContainers';
import styled from 'styled-components';

const StyledTable = styled('table')`
	border-spacing: 0.5rem;
	border-collapse: separate;
`;

const Label = styled('td')`
	font-weight: 500;
	font-size: 1.125rem;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	color: ${STRINGS.ACCENT_COLOR};
	text-align: right;
`;

const Value = styled('td')`
	font-size: 1.125rem;
	font-family: 'Roboto', sans-serif;
	font-weight: 100;
`;

export const GET_HACKER_DATA = gql`
	query HackerData($email: String!) {
		getHackerByEmail(email: $email) {
			firstName
			lastName
			email
			school
		}
	}
`;

interface RowProps {
	label: string;
	value: string;
}

const Row: React.FunctionComponent<RowProps> = (props: RowProps): JSX.Element => {
	const { label, value } = props;

	return (
		<tr>
			<Label>{label}</Label>
			<Value>{value}</Value>
		</tr>
	);
};

interface Props {
	location: {
		state: {
			email: string;
		};
	};
}

export const HackerView: React.FunctionComponent<Props> = (props: Props): JSX.Element => {
	console.log(props.location.state);

	return (
		<Query query={GET_HACKER_DATA} variables={{ email: 'ml@mattleon.com' }}>
			{({ data, loading, error }) => {
				if (loading) {
					return <Spinner />;
				}

				if (error) {
					console.log(error);
					return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
				}

				console.log(data);
				// console.log(data.getHackerByEmail.teamName);
				const { firstName, lastName, email, school } = data.getHackerByEmail;

				return (
					<>
						<StyledTable>
							<tbody>
								<Row label="First Name:" value={firstName} />
								<Row label="Last Name:" value={lastName} />
								<Row label="Email:" value={email} />
								<Row label="School:" value={school} />
							</tbody>
						</StyledTable>
						//
					</>
				);
			}}
		</Query>
	);
};

export default HackerView;
