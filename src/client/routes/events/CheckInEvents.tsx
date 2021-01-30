import React, { FC, useMemo } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { Button } from '../../components/Buttons/Button';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { FlexColumn, FlexStartColumn } from '../../components/Containers/FlexContainers';
import { Title } from '../../components/Text/Title';
import STRINGS from '../../assets/strings.json';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import {
	useCheckInUserToEventAndUpdateEventScoreMutation,
	CheckInUserToEventAndUpdateEventScoreMutationHookResult,
	useEventsForHackersQuery,
	useMyEventStatusQuery,
} from '../../generated/graphql';
import { Spinner } from '../../components/Loading/Spinner';

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
		a {
			width: 100%;
		}
	}
`;

function getOnCheckIn(
	checkIn: CheckInUserToEventAndUpdateEventScoreMutationHookResult[0]
): (eventId: string, userId: string) => Promise<void> {
	return async function onCheckIn(eventId: string, userId: string) {
		try {
			await checkIn({
				variables: {
					input: {
						event: eventId,
						user: userId,
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
	};
}

export const CheckInEvent: FC = () => {
	const events = useEventsForHackersQuery();
	const hacker = useMyEventStatusQuery();
	const [checkIn] = useCheckInUserToEventAndUpdateEventScoreMutation();
	const onCheckIn = useMemo(() => getOnCheckIn(checkIn), [checkIn]);

	if (events.loading || hacker.loading) {
		return <Spinner />;
	}

	if (events.error || hacker.error || !events.data || !hacker.data || !hacker.data.me) {
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	// Satisfy type system that reference is still defined in closures below.
	const { me } = hacker.data;

	const currentEvents = events.data.events.filter(({ startTimestamp, duration }) => {
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
					{currentEvents.map(row => (
						<FlexColumn key={row.id}>
							<SmallCenteredText
								color={`${STRINGS.DARK_TEXT_COLOR}`}
								fontSize="1.3rem"
								margin="1.4rem">
								<span style={{ fontWeight: 'bold' }}>{row.name}</span>
							</SmallCenteredText>
							<Button
								key={row.id}
								large
								async
								disabled={me.eventsAttended.includes(row.id)}
								onClick={() => onCheckIn(row.id, me.id)}>
								{me.eventsAttended.includes(row.id) ? 'Checked In!' : 'Check In'}
							</Button>
						</FlexColumn>
					))}
				</FlexColumn>
			</HackerDashBG>
		</FlexStartColumn>
	);
};

export default CheckInEvent;
