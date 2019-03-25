import React, { FunctionComponent, useState, useEffect } from 'react';
import TextInput from '../../components/Input/TextInput';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import SearchBox from '../../components/Input/SearchBox';
import TextButton from '../../components/Buttons/TextButton';
import STRINGS from '../../assets/strings.json';
import ActionButton from '../../components/Buttons/ActionButton';
import styled from 'styled-components';

const Layout = styled.div`
	flex-direction: column;
`;

interface Props {}

export const Team: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const [searchValue, setSearchValue] = useState('');

	return (
		<FloatingPopup borderRadius="1rem" height="100%" backgroundOpacity="1" padding="1.5rem">
			<Layout>
				<SearchBox
					value={searchValue}
					placeholder={'Find team'}
					onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
						setSearchValue(event.target.value);
						console.log(event.target.value);
					}}
				/>
				<ActionButton>Join</ActionButton>
			</Layout>
		</FloatingPopup>
	);
};

export default Team;
