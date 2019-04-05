import React, { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';
import SearchBox from '../../components/Input/SearchBox';
import STRINGS from '../../assets/strings.json';
import ActionButton from '../../components/Buttons/ActionButton';
import { GET_TEAM } from './Team';

const JOIN_TEAM = gql`
	mutation AddHackerToTeam($email: String!, $teamName: String!) {
		addHackerToTeam(email: $email, teamName: $teamName)
	}
`;

const Layout = styled.div`
	margin-bottom: 0.125rem;
`;

const ErrorMsg = styled.p`
	text-align: center;
	font-size: 1rem;
	color: ${STRINGS.WARNING_COLOR};
	white-space: pre-line;
`;

export const JoinTeam: FunctionComponent = (): JSX.Element => {
	const [searchValue, setSearchValue] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const emailAddress = 'ml@mattleon.com';

	return (
		<Mutation mutation={JOIN_TEAM}>
			{(mutation, { error }): JSX.Element => (
				<>
					<Layout>
						<SearchBox
							value={searchValue}
							placeholder="Type team name here"
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								setSearchValue(event.target.value);
							}}
							minWidth="26rem"
							width="26rem"
							error={errorMsg !== ''}
							hasIcon={false}
						/>
						<ActionButton
							onClick={(): void => {
								mutation({
									refetchQueries: [{ query: GET_TEAM, variables: { email: emailAddress } }],
									variables: { email: emailAddress, teamName: searchValue },
								});
								if (!error) {
									setErrorMsg('');
								} else {
									setErrorMsg(
										'Team size has already reached the limit.\nPlease join or create another team.'
									);
								}
							}}>
							{`Join`}
						</ActionButton>
					</Layout>
					<ErrorMsg>{errorMsg}</ErrorMsg>
				</>
			)}
		</Mutation>
	);
};

export default JoinTeam;
