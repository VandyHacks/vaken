import React, { FC } from 'react';
import styled from 'styled-components';
import { useLeaveTeamMutation } from '../../generated/graphql';
import { FlexColumn } from '../../components/Containers/FlexContainers';
import STRINGS from '../../assets/strings.json';
import { Title } from '../../components/Text/Title';
import { CenterButtonText } from '../../components/Buttons/Buttons';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import TextButton from '../../components/Buttons/TextButton';

interface ButtonProps {
	background?: string;
}

const Status = styled.div`
	background: ${({ background = 'rgba(255, 255, 255, 1)' }: ButtonProps): string => background};
	padding: 1rem 2rem;
	margin-bottom: 1rem;
`;

interface Props {
	teamName: string;
}

export const ViewTeam: FC<Props> = ({ teamName }: Props): JSX.Element => {
	const [leaveTeam] = useLeaveTeamMutation();

	return (
		<FlexColumn>
			<Title fontSize="1.3rem" color={STRINGS.DARK_TEXT_COLOR} margin="0.5rem">
				You have joined:
			</Title>
			<Status background={STRINGS.LIGHT_TEXT_COLOR}>
				<CenterButtonText color={STRINGS.DARK_TEXT_COLOR} fontWeight="bold" fontSize="1.8rem">
					{teamName}
				</CenterButtonText>
			</Status>
			<TextButton
				color="white"
				fontSize="1.4em"
				background={STRINGS.ACCENT_COLOR}
				glowColor="rgba(0, 0, 255, 0.67)"
				onClick={() => leaveTeam()}>
				<p>Leave team</p>
			</TextButton>
			<SmallCenteredText color={STRINGS.DARK_TEXT_COLOR} fontSize="1rem" margin="0rem">
				{STRINGS.HACKER_TEAMS_FOOTER_TEXT}
			</SmallCenteredText>
		</FlexColumn>
	);
};

export default ViewTeam;
