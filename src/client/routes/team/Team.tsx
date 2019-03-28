import React, { FunctionComponent } from 'react';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import JoinTeam from './JoinTeam';
import ViewTeam from './ViewTeam';
import styled from 'styled-components';
import { displayFlex } from '../../components/Containers/FlexContainers';
import Announcment from '../../components/Text/Announcment';

const Layout = styled.div`
	${displayFlex}
`;

interface Props {}

export const Team: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const joined = true;

	return (
		<Layout>
			<Announcment
				value={
					'Create a new team or join an existing one for the weekend! Due to prize arrangments, the maximum number of hackers per team is 4.\n\n There will also be opportunities at the event to form teams.'
				}
			/>
			<FloatingPopup borderRadius="1rem" width="35rem" backgroundOpacity="1" padding="1.5rem">
				{joined ? <ViewTeam /> : <JoinTeam />}
			</FloatingPopup>
		</Layout>
	);
};

export default Team;
