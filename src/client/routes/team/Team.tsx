import React, { FunctionComponent } from 'react';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import JoinTeam from './JoinTeam';
import ViewTeam from './ViewTeam';
import styled from 'styled-components';
import { displayFlex } from '../../components/Containers/FlexContainers';
import Announcment from '../../components/Text/Announcment';
import STRINGS from '../../assets/strings.json';

const Layout = styled.div`
	${displayFlex}
`;

interface Props {}

export const Team: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const joined = true;

	return (
		<Layout>
			<Announcment
				value={STRINGS.HACKER_TEAMS_ANNOUNCMENT_TEXT}
			/>
			<FloatingPopup borderRadius="1rem" width="35rem" backgroundOpacity="1" padding="1.5rem">
				{joined ? <ViewTeam /> : <JoinTeam />}
			</FloatingPopup>
		</Layout>
	);
};

export default Team;
