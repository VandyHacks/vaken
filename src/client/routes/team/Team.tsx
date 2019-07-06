import React, { FC } from 'react';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { JoinTeam } from './JoinTeam';
import { ViewTeam } from './ViewTeam';
import { FlexColumn } from '../../components/Containers/FlexContainers';
import Announcment from '../../components/Text/Announcment';
import STRINGS from '../../assets/strings.json';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import { Spinner } from '../../components/Loading/Spinner';
import { useTeamQuery } from '../../generated/graphql';

export const Team: FC = () => {
	const { loading, error, data } = useTeamQuery();

	if (loading) {
		return <Spinner />;
	}
	if (error || !data || !data.me) {
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_HACKER_ERROR_MESSAGE} />;
	}

	const { team } = data.me;

	return (
		<FlexColumn>
			<Announcment value={STRINGS.HACKER_TEAMS_ANNOUNCMENT_TEXT} />
			<FloatingPopup borderRadius="1rem" width="35rem" backgroundOpacity="1" padding="1.5rem">
				{!team || !team.name ? <JoinTeam /> : <ViewTeam teamName={team.name} />}
			</FloatingPopup>
		</FlexColumn>
	);
};

export default Team;
