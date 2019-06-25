import React, { FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { useMutation } from 'react-apollo-hooks';
import { FlexColumn } from '../../components/Containers/FlexContainers';
import STRINGS from '../../assets/strings.json';
import { Title } from '../../components/Text/Title';
import { CenterButtonText } from '../../components/Buttons/Buttons';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import TextButton from '../../components/Buttons/TextButton';
import { GET_TEAM, LEAVE_TEAM } from './teams.graphql';
import { AuthContext } from '../../contexts/AuthContext';

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

export const ViewTeam: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const user = useContext(AuthContext);
	const { email } = user;
	const { teamName } = props;

	const leaveTeam = useMutation(LEAVE_TEAM, {
		refetchQueries: [{ query: GET_TEAM, variables: { email } }],
		variables: {
			email,
		},
	});

	return (
		<FlexColumn>
			<Title fontSize="1.3rem" color={STRINGS.DARK_TEXT_COLOR} margin="0.5rem">
				{`You have joined:`}
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
				text="Leave team"
				glowColor="rgba(0, 0, 255, 0.67)"
				onClick={() => leaveTeam()}
			/>
			<SmallCenteredText color={STRINGS.DARK_TEXT_COLOR} fontSize="1rem" margin="0rem">
				{STRINGS.HACKER_TEAMS_FOOTER_TEXT}
			</SmallCenteredText>
		</FlexColumn>
	);
};

export default ViewTeam;
