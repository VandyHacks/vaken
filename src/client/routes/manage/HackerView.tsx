import React, { useState } from 'react';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import Spinner from '../../components/Loading/Spinner';
import STRINGS from '../../assets/strings.json';
import { FlexStartColumn } from '../../components/Containers/FlexContainers';
import styled from 'styled-components';
import { Title } from '../../components/Text/Title';
import { Redirect } from 'react-router-dom';

const Profile = styled.div`
	grid-area: profile;
`;

const Application = styled.div`
	grid-area: application;
`;

const Layout = styled.div`
	display: grid;
	grid-template-columns: 30% 2rem auto;
	grid-template-rows: auto;
	grid-template-areas: 'profile . application';
`;

const StyledTable = styled('table')`
	border-spacing: 0.5rem;
	border-collapse: separate;
`;

const HorizontalLine = styled.hr`
	margin: 0 2rem;
	border: 0.0625rem solid ${STRINGS.ACCENT_COLOR};
	margin-bottom: 0.25rem;
`;

const Label = styled('td')`
	font-weight: 500;
	font-size: 0.875rem;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	color: ${STRINGS.DARK_TEXT_COLOR};
	text-align: right;
`;

const Value = styled('td')`
	font-size: 0.875rem;
	font-family: 'Roboto', sans-serif;
	font-weight: 100;
	color: ${STRINGS.DARK_TEXT_COLOR};
`;

export const GET_HACKER_DATA = gql`
	query HackerData($email: String!) {
		getHackerByEmail(email: $email) {
			firstName
			lastName
			email
			school
			status
			needsReimbursement
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
	console.log(props.location.state.email);
	if (!props || !props.location || !props.location.state || !props.location.state.email) {
		return <Redirect to="/manageHackers" />;
	} else {
		return (
			<Query query={GET_HACKER_DATA} variables={{ email: props.location.state.email }}>
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
					const {
						firstName,
						lastName,
						email,
						school,
						status,
						needsReimbursement,
					} = data.getHackerByEmail;

					return (
						<Layout>
							<Profile>
								<Title
									margin="0.25rem"
									fontSize="1.5rem"
									textAlign="center"
									color={STRINGS.DARKEST_TEXT_COLOR}>
									Profile
								</Title>
								<HorizontalLine />
								<StyledTable>
									<tbody>
										<Row label="First Name:" value={firstName} />
										<Row label="Last Name:" value={lastName} />
										<Row label="Email:" value={email} />
										<Row label="School:" value={school} />
										<Row label="Status:" value={status} />
									</tbody>
								</StyledTable>
							</Profile>
							<Application>
								<Title
									margin="0.25rem"
									fontSize="1.5rem"
									textAlign="center"
									color={STRINGS.DARKEST_TEXT_COLOR}>
									Application
								</Title>
								<HorizontalLine />
								<StyledTable>
									<tbody>
										<Row label="Needs Reimbursement:" value={needsReimbursement ? 'yes' : 'no'} />
										<Row
											label="Essay Response 1:"
											value={
												'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
											}
										/>
										<Row
											label="Essay Response 2:"
											value={
												'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
											}
										/>
									</tbody>
								</StyledTable>
							</Application>
						</Layout>
					);
				}}
			</Query>
		);
	}
};

export default HackerView;
