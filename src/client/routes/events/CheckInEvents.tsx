import React, { FunctionComponent, useState, useEffect, RefObject } from 'react';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import TextButton, { StyledLoginBtn } from '../../components/Buttons/TextButton';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { FlexColumn, FlexStartColumn } from '../../components/Containers/FlexContainers';
import { Title } from '../../components/Text/Title';
import STRINGS from '../../assets/strings.json';
import { ButtonOutline, CenterButtonText } from '../../components/Buttons/Buttons';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import {
	useMeQuery,
	useCheckInUserToEventMutation,
	useEventsForHackersQuery,
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
export const CheckInEvent: FunctionComponent = (): JSX.Element => {
	const { data, loading } = useMeQuery();
	const eventsQuery = useEventsForHackersQuery();
	const eventsLoading = eventsQuery.loading;
	const eventsError = eventsQuery.error;
	const eventsData = eventsQuery.data;

	if (eventsLoading || !eventsData) {
		return <Spinner />;
	}

	if (eventsError) {
		console.log(eventsError);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	const eventRows = eventsData.events
		.map(e => {
			return {
				id: e.id,
				name: e.name,
				eventType: e.eventType,
				startTimestamp: new Date(e.startTimestamp),
			};
		})
		.sort((a, b) => a.startTimestamp.getTime() - b.startTimestamp.getTime());

	// This is where we stopped 9/28/20. Not sure why useEffect is not working
	// trying to get eventsData to render
	useEffect((): void => {
		if (eventsData) {
			console.log(eventsData);
		}
	}, [eventsData]);

	const now = Date.now();
	const eventsCurrent = eventRows.filter(e => {
		const TIME_BUFFER = 60; // 60 minutes
		const delta = (now - e.startTimestamp) / (1000 * 60); // Time diff in minutes
		return delta >= -1 * TIME_BUFFER && delta <= e.duration + TIME_BUFFER;
	});

	return (
		<>
			<FlexStartColumn>
				<HackerDashBG>
					<FlexColumn>
						<Title fontSize="1.75rem">Ongoing Events:</Title>
						{loading ? null : (
							<>
								{eventRows.map(row => (
									<SmallCenteredText
										key={row.gcalID}
										color={`${STRINGS.DARK_TEXT_COLOR}`}
										fontSize="1rem"
										margin="1.4rem">
										<span style={{ fontWeight: 'bold' }}>Hello Again</span>
										<br />
										Hello x3
									</SmallCenteredText>
								))}
								{eventAttended ? (
									<SmallCenteredText color={`${STRINGS.DARK_TEXT_COLOR}`}>
										You are already checked in!
									</SmallCenteredText>
								) : (
									<TextButton
										key={event.id}
										color="white"
										fontSize="1.4em"
										background={STRINGS.ACCENT_COLOR}
										glowColor="rgba(0, 0, 255, 0.67)"
										onClick={async () => {
											toast.dismiss();
											// checkinUserToEventUpdateScoreMutation
											// check if the update went successfully
											if (false) {
												toast.error('Check-in failed!', {
													position: 'bottom-right',
												});
											} else {
												toast.dismiss();
												return toast.success('You have been checked in successfully!', {
													position: 'bottom-right',
												});
												// });
											}
											return Promise.resolve();
										}}>
										Check In
									</TextButton>
								)}
							</>
						)}
					</FlexColumn>
				</HackerDashBG>
			</FlexStartColumn>
		</>
	);
};

export default CheckInEvent;
