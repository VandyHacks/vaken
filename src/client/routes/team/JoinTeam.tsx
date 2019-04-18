import React, { FunctionComponent, useState, useContext } from 'react';
import styled from 'styled-components';
import { useMutation } from 'react-apollo-hooks';
import { gql } from 'apollo-boost';
import SearchBox from '../../components/Input/SearchBox';
import STRINGS from '../../assets/strings.json';
import ActionButton from '../../components/Buttons/ActionButton';
import { GET_TEAM } from './Team';
import { AuthContext } from '../../contexts/AuthContext';
import { FlexDiv } from '../../components/Containers/FlexContainers';

const JOIN_TEAM = gql`
	mutation JoinTeam($email: String!, $teamName: String!) {
		joinTeam(email: $email, teamName: $teamName)
	}
`;

const Layout = styled.div`
	margin-bottom: 0.125rem;
`;

const Wrapper = styled.div`
	align-items: flex-start;
`;

const ErrorMsg = styled.p`
	font-size: 1rem;
	color: ${STRINGS.WARNING_COLOR};
	white-space: pre-line;
`;

export const JoinTeam: FunctionComponent = (): JSX.Element => {
	const [searchValue, setSearchValue] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const user = useContext(AuthContext);
	const { email } = user;

	const joinTeam = useMutation(JOIN_TEAM, {
		refetchQueries: [{ query: GET_TEAM, variables: { email } }],
		variables: {
			email,
			teamName: searchValue,
		},
	});

	return (
		<Wrapper>
			<Layout>
				<SearchBox
					value={searchValue}
					placeholder="Type team name here"
					onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
						setSearchValue(event.target.value);
					}}
					minWidth="26rem"
					width="26rem"
					error={errorMsg !== ''}
					hasIcon={false}
				/>
				<ActionButton
					onClick={() =>
						joinTeam().catch(res => {
							setErrorMsg(res.graphQLErrors[0].message);
						})
					}>
					{'Join'}
				</ActionButton>
			</Layout>
			<ErrorMsg>{errorMsg}</ErrorMsg>
		</Wrapper>
	);
};

export default JoinTeam;
