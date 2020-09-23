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
import { useMeQuery, useCheckInUserToEventMutation, useEventsQuery } from '../../generated/graphql';

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
	const eventsQuery = useEventsQuery();
	const eventsLoading = eventsQuery.loading;
	const eventsError = eventsQuery.error;
	const eventsData = eventsQuery.data;

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

	return (
		<>
			<FlexStartColumn>
				<HackerDashBG>
					<FlexColumn>
						<Title fontSize="1.75rem">Ongoing Events:</Title>
						{loading ? null : (
							<>
								{/* <ButtonOutline
									paddingLeft="4rem"
									paddingRight="4rem"
									width="auto"
									background="#FFFFFF"
									glowColor="null">
									<CenterButtonText color="#FFFFFF" fontSize="1.8rem">
										Hello
									</CenterButtonText>
								</ButtonOutline> */}
								<SmallCenteredText
									color={`${STRINGS.DARK_TEXT_COLOR}`}
									fontSize="1rem"
									margin="1.4rem">
									<span style={{ fontWeight: 'bold' }}>Hello Again</span>
									<br />
									Hello x3
								</SmallCenteredText>
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
