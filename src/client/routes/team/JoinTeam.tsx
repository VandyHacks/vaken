import React, { FunctionComponent, useState, useContext } from 'react';
import styled from 'styled-components';
import { useMutation } from 'react-apollo-hooks';
import SearchBox from '../../components/Input/SearchBox';
import STRINGS from '../../assets/strings.json';
import { ActionButton } from '../../components/Buttons/ActionButton';
import { AuthContext } from '../../contexts/AuthContext';
import { GET_TEAM, JOIN_TEAM } from './teams.graphql';

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
