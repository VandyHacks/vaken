import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import SearchBox from '../../components/Input/SearchBox';
import STRINGS from '../../assets/strings.json';
import ActionButton from '../../components/Buttons/ActionButton';
import { Mutation } from 'react-apollo';
import { gql } from 'apollo-boost';

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

interface Props {}

export const JoinTeam: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const [searchValue, setSearchValue] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	return (
		<Mutation mutation={JOIN_TEAM}>
			{(mutation, { error }) => (
				<>
					<Layout>
						<SearchBox
							value={searchValue}
							placeholder="Find team"
							onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
								setSearchValue(event.target.value);
							}}
							minWidth="26rem"
							width="26rem"
							error={errorMsg !== ''}
						/>
						<ActionButton
							onClick={() => {
								mutation({
									variables: { email: "ml@mattleon.com", teamName: searchValue },
									// refetchQueries: [{ query: GET_HACKERS }],
								});
								if (error) {
									setErrorMsg('');
									console.log("success!");
								} else {
									setErrorMsg(
										'Team size has already reached the limit.\nPlease join or create another team.'
									);
									console.log(error);
								}
								// console.log(searchValue);
							}}>
							Join
						</ActionButton>
					</Layout>
					<ErrorMsg>{errorMsg}</ErrorMsg>
				</>
			)}
		</Mutation>
	);
};

export default JoinTeam;
