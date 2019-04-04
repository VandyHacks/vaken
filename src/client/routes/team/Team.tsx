import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import JoinTeam from './JoinTeam';
import ViewTeam from './ViewTeam';
import { displayFlex } from '../../components/Containers/FlexContainers';
import Announcment from '../../components/Text/Announcment';
import STRINGS from '../../assets/strings.json';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import Spinner from '../../components/Loading/Spinner';

const Layout = styled.div`
	${displayFlex}
`;

export const GET_TEAM = gql`
	query HackerTeam($email: String!) {
		getHackerByEmail(email: $email) {
			teamName
		}
	}
`;

interface Props {}

export const Team: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const joined = true;

	return (
		<Layout>
			<Announcment value={STRINGS.HACKER_TEAMS_ANNOUNCMENT_TEXT} />
			<FloatingPopup borderRadius="1rem" width="35rem" backgroundOpacity="1" padding="1.5rem">
				<Query query={GET_TEAM} variables={{ email: 'ml@mattleon.com' }}>
					{({ data, loading, error }) => {
						if (loading) {
							return <Spinner />;
						}

						if (error) {
							console.log(error);
							return <GraphQLErrorMessage text={STRINGS.GRAPHQL_HACKER_ERROR_MESSAGE} />;
						}

						console.log(data);
						// console.log(data.getHackerByEmail.teamName);
						return data.getHackerByEmail.teamName === '' ? (
							<JoinTeam />
						) : (
							<ViewTeam teamName={data.getHackerByEmail.teamName} />
						);
					}}
				</Query>
			</FloatingPopup>
		</Layout>
	);
};

export default Team;
// Copyright (c) 2019 Vanderbilt University
