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
import { useMyStatusQuery, CheckInUserToEventMutation } from '../../generated/graphql';

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
	const { data, loading } = useMyStatusQuery();

	//
	const ongoingEvent = {
		title: 'Welcome',
	};

	const [eventAttended, setEventAttended] = useState(false);

	useEffect((): void => {
		if (data && data.me && data.me.__typename === 'Hacker') {
			console.log(data.me.status);
		}
	}, [data]);

	// check if user already registered
	// useEffect();

	// fetch the ongoing event
	// useEffect();

	return (
		<>
			<FlexStartColumn>
				<HackerDashBG>
					<FlexColumn>
						<Title fontSize="1.75rem">Ongoing Events:</Title>
						{loading ? null : (
							<>
								<ButtonOutline
									paddingLeft="4rem"
									paddingRight="4rem"
									width="auto"
									background="#FFFFFF"
									glowColor="null">
									<CenterButtonText color="#FFFFFF" fontSize="1.8rem">
										Hello
									</CenterButtonText>
								</ButtonOutline>
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
										key={ongoingEvent.title}
										color="white"
										fontSize="1.4em"
										background={STRINGS.ACCENT_COLOR}
										glowColor="rgba(0, 0, 255, 0.67)"
										onClick={
											async () => {
												toast.dismiss();
												// checkinUserToEventUpdateScoreMutation
												// check if the update went successfully
												if (false) {
													toast.error('Check-in failed!', {
														position: 'bottom-right',
													});
												} else {
													// return updateApplication({
													// 	variables: { input: { fields: input, submit: true } },
													// }).then(() => {
													toast.dismiss();
													return toast.success('You have been checked in successfully!', {
														position: 'bottom-right',
													});
													// });
												}
												return Promise.resolve();
											}
											// console.log(e);
										}>
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
