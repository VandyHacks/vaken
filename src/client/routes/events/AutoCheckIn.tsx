import React, { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { FlexColumn, FlexStartColumn } from '../../components/Containers/FlexContainers';
import { Title } from '../../components/Text/Title';
import STRINGS from '../../assets/strings.json';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import {
	useCheckInUserToEventAndUpdateEventScoreMutation,
	CheckInUserToEventAndUpdateEventScoreMutationHookResult,
	useMyEventStatusQuery,
} from '../../generated/graphql';
import { Spinner } from '../../components/Loading/Spinner';

const HackerDashBG = styled(FloatingPopup)`
	border-radius: 8px;
	height: min-content;
	width: 36rem;
	background: ${STRINGS.BACKGROUND_DARK_SECONDARY};
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

interface AutoCheckInId {
	id: string;
}

export const CheckInEvent: FC = () => {
	const { id } = useParams<AutoCheckInId>();
	const hacker = useMyEventStatusQuery();
	const [checkIn] = useCheckInUserToEventAndUpdateEventScoreMutation();
	const onCheckIn = useMemo(() => getOnCheckIn(checkIn), [checkIn]);

	useEffect(() => {
		if (!hacker.error && hacker.data && hacker.data.me && id && id !== ':id') {
			const { me } = hacker.data;
			if (!me.eventsAttended.includes(id)) {
				const tempFunc = async (): Promise<void> => onCheckIn(id, me.id);
				tempFunc().catch(console.log);
			}
		}
	}, [hacker, id]);

	if (hacker.loading) {
		return <Spinner />;
	}

	if (hacker.error || !hacker.data || !hacker.data.me) {
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	const { me } = hacker.data;

	return (
		<FlexStartColumn>
			<HackerDashBG>
				<FlexColumn>
					<Title fontSize="1.75rem">Your Score:</Title>
					<SmallCenteredText color={`${STRINGS.DARK_TEXT_COLOR}`} fontSize="1.3rem" margin="1rem">
						<span style={{ fontWeight: 'bold' }}>{me.eventScore ?? '0'}</span>
					</SmallCenteredText>
				</FlexColumn>
			</HackerDashBG>
		</FlexStartColumn>
	);
};

export default CheckInEvent;
