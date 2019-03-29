import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import SearchBox from '../../components/Input/SearchBox';
import STRINGS from '../../assets/strings.json';
import ActionButton from '../../components/Buttons/ActionButton';

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
	const [error, setError] = useState('');

	return (
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
					error={error !== ''}
				/>
				<ActionButton
					onClick={() => {
						if (error) {
							setError('');
						} else {
							setError(
								'Team size has already reached the limit.\nPlease join or create another team.'
							);
						}
						console.log(searchValue);
					}}>
					Join
				</ActionButton>
			</Layout>
			<ErrorMsg>{error}</ErrorMsg>
		</>
	);
};

export default JoinTeam;
