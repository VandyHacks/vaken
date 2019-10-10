import React, { FC, useState, ChangeEventHandler, useCallback } from 'react';
import styled from 'styled-components';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import { SearchBox } from '../../components/Input/SearchBox';
import { ActionButton } from '../../components/Buttons/ActionButton';
import { useJoinTeamMutation } from '../../generated/graphql';

const Layout = styled.div`
	margin-bottom: 0.125rem;
`;

const Wrapper = styled.div`
	align-items: flex-start;
`;

export const JoinTeam: FC = () => {
	const [searchValue, setSearchValue] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
	const [joinTeam] = useJoinTeamMutation({ variables: { input: { name: searchValue } } });

	const onChangeHandler: ChangeEventHandler<HTMLInputElement> = useCallback(
		({ currentTarget: { value } }) => void setSearchValue(value),
		[setSearchValue]
	);

	return (
		<Wrapper>
			{errorMsg ? (
				<GraphQLErrorMessage text={errorMsg} />
			) : (
				<Layout>
					<SearchBox
						value={searchValue}
						placeholder="Type team name here"
						onChange={onChangeHandler}
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
						Join
					</ActionButton>
				</Layout>
			)}
		</Wrapper>
	);
};

export default JoinTeam;
