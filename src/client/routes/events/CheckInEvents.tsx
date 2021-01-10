import React, { FC } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import TextButton, { StyledLoginBtn } from '../../components/Buttons/TextButton';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { FlexColumn, FlexStartColumn } from '../../components/Containers/FlexContainers';
import { Title } from '../../components/Text/Title';
import STRINGS from '../../assets/strings.json';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import {
	useCheckInUserToEventAndUpdateEventScoreMutation,
	useEventsForHackersQuery,
	useMyEventStatusQuery,
} from '../../generated/graphql';
import Spinner from '../../components/Loading/Spinner';

const HackerDashBG = styled(FloatingPopup)`
	border-radius: 8px;
	height: min-content;
	width: 36rem;
	background: rgba(247, 245, 249, 1);
	padding: 1.5rem;

	@media screen and (max-width: 456px) {
		width: 100%;
	}

	@media screen and (max-width: 400px) {
		a,
		${StyledLoginBtn} {
			width: 100%;
		}
	}
`;
export const CheckInEvent: FC = () => {
	const events = useEventsForHackersQuery();
	const hacker = useMyEventStatusQuery();
	const [checkIn] = useCheckInUserToEventAndUpdateEventScoreMutation();

	if (events.loading || !events.data || hacker.loading || !hacker.data || !hacker.data.me) {
		return <Spinner />;
	}

	// Satisfy type system that reference is still defined in closures below.
	const { me } = hacker.data;

	if (events.error || hacker.error) {
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	const eventsCurrent = events.data.events.filter(({ startTimestamp, duration }) => {
		const TIME_BUFFER = 5; // 5 minutes
		const delta = (Date.now() - startTimestamp) / (1000 * 60); // Time diff in minutes
		return delta >= -1 * TIME_BUFFER && delta <= duration + TIME_BUFFER;
	});

	return (
		<FlexStartColumn>
			<HackerDashBG>
				<FlexColumn>
					<Title fontSize="1.75rem">Your Score:</Title>
					<SmallCenteredText color={`${STRINGS.DARK_TEXT_COLOR}`} fontSize="1.3rem" margin="1rem">
						<span style={{ fontWeight: 'bold' }}>{me.eventScore ?? '0'}</span>
					</SmallCenteredText>
					<Title fontSize="1.75rem">Ongoing Events:</Title>
					{eventsCurrent.map(row => (
						<FlexColumn key={row.id}>
							<SmallCenteredText
								color={`${STRINGS.DARK_TEXT_COLOR}`}
								fontSize="1.3rem"
								margin="1.4rem">
								<span style={{ fontWeight: 'bold' }}>{row.name}</span>
							</SmallCenteredText>
							<TextButton
								key={row.id}
								color="white"
								fontSize="1.4em"
								background={STRINGS.ACCENT_COLOR}
								glowColor="rgba(0, 0, 255, 0.67)"
								enabled={!me.eventsAttended.includes(row.id)}
								onClick={async () => {
									toast.dismiss();
									try {
										await checkIn({
											variables: {
												input: {
													event: row.id,
													user: me.id ?? '',
													eventScore: row.eventScore ?? 0,
												},
											},
										});
										toast.dismiss();
										return void toast.success('You have been checked in successfully!');
									} catch (e) {
										toast.dismiss();
										if (e.message.includes('is already checked into event')) {
											return void toast.error('You are already checked in!');
										}
										return void toast.error('Check-in failed!');
									}
								}}>
								{me.eventsAttended.includes(row.id) ? 'Checked In!' : 'Check In'}
							</TextButton>
						</FlexColumn>
					))}
				</FlexColumn>
			</HackerDashBG>
		</FlexStartColumn>
	);
};

export default CheckInEvent;
