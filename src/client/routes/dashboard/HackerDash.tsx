import React, { FunctionComponent, useState, useEffect, RefObject } from 'react';
import styled from 'styled-components';
import TextButton, { StyledLoginBtn } from '../../components/Buttons/TextButton';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { FlexColumn, FlexStartColumn } from '../../components/Containers/FlexContainers';
import { Title } from '../../components/Text/Title';
import STRINGS from '../../assets/strings.json';
import { ButtonOutline, CenterButtonText } from '../../components/Buttons/Buttons';
import applicationIncompleteSVG from '../../assets/img/application_incomplete.svg';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import {
	ApplicationStatus,
	useMyStatusQuery,
	useConfirmMySpotMutation,
	useDeclineMySpotMutation
} from '../../generated/graphql';

const Confetti = React.lazy(() => import('react-confetti'));

const statusConfig = {
	[ApplicationStatus.Created]: {
		actions: [
			{
				action: () => void (window.location.href = '/application'),
				actionText: 'Complete your application',
			},
		],
		boldText: "You haven't started your application yet.",
		img: applicationIncompleteSVG,
		status: 'Not Started',
		statusBG: '#FBE4E8',
		statusColor: '#FF647C',
		text: `The deadline is ${STRINGS.DEADLINE}`,
	},
	[ApplicationStatus.Started]: {
		actions: [
			{
				action: () => void (window.location.href = '/application'),
				actionText: 'Complete your application',
			},
		],
		boldText: 'You still need to finish your application.',
		img: applicationIncompleteSVG,
		status: 'Incomplete',
		statusBG: '#FBE4E8',
		statusColor: '#FF647C',
		text: `The deadline is ${STRINGS.DEADLINE}`,
	},
	[ApplicationStatus.Submitted]: {
		actions: [
			{
				action: () => void (window.location.href = '/application'),
				actionText: 'Update your application',
			},
		],
		boldText: "Thanks for applying! We'll get back to you with a decision shortly.",
		img: applicationIncompleteSVG,
		status: 'Submitted',
		statusBG: '#D5F2EA',
		statusColor: 'hsl(163.4,52.7%,35%)',
		text: "You may update your responses at any time by re-visiting the application.'",
	},
	[ApplicationStatus.Confirmed]: {
		actions: [
			{
				action: () => void undefined,
				actionText: '',
			},
		],
		boldText: "Whoo hoo! We'll see you Nov. 1st!",
		img: applicationIncompleteSVG,
		status: 'Confirmed',
		statusBG: '#D5F2EA',
		statusColor: 'hsl(163.4,52.7%,35%)',
		text: "If you don't have a team, you can form one when you get here!",
	},
	[ApplicationStatus.Accepted]: {
		actions: [
			{
				action: () => void undefined, // Overridden in HackerDash component
				actionText: 'Confirm your spot',
			},
			{
				action: () => void undefined, // Overridden in HackerDash component
				actionText: "Can't go :(",
			},
		],
		boldText: "You've been accepted!",
		img: applicationIncompleteSVG,
		status: 'Accepted',
		statusBG: '#D5F2EA',
		statusColor: 'hsl(163.4,52.7%,35%)',
		text: "Confirm your spot to let us know you'll be coming",
	},
	[ApplicationStatus.Declined]: {
		actions: [],
		boldText: "You've declined. We're sorry to see you go!",
		img: applicationIncompleteSVG,
		status: 'Declined',
		statusBG: '#9C9C9C',
		statusColor: 'hsl(163.4,52.7%,35%)',
		text: '',
	},
	[ApplicationStatus.Rejected]: {
		actions: [
			{
				action: () => void undefined,
				actionText: '',
			},
		],
		boldText: "Unfortunately, we couldn't offer you a spot this year :(",
		img: applicationIncompleteSVG,
		status: 'Denied',
		statusBG: '#FBE4E8',
		statusColor: '#FF647C',
		text: '',
	},
};

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

export const HackerDash: FunctionComponent = (): JSX.Element => {
	const { data, loading } = useMyStatusQuery();
	const [statusInfo, setStatusInfo] = useState(statusConfig[ApplicationStatus.Created]);
	const [confirmMySpot] = useConfirmMySpotMutation();
	const [declineMySpot] = useDeclineMySpotMutation();
	const [showConfetti, setShowConfetti] = useState(false);

	useEffect((): void => {
		if (data && data.me && data.me.__typename === 'Hacker') {
			console.log(data.me.status);
			setStatusInfo(statusConfig[data.me.status as keyof typeof statusConfig]);
		}
	}, [data]);

	useEffect((): void => {
		statusConfig[ApplicationStatus.Accepted].actions[0].action = () => {
			confirmMySpot()
				.then(() => setShowConfetti(true))
				.catch(err => console.error(err));
			return undefined;
		};
		statusConfig[ApplicationStatus.Accepted].actions[1].action = () => {
			declineMySpot()
				// no confetti :(
				.catch(err => console.error(err));
			return undefined;
		};
	}, [confirmMySpot, declineMySpot]);

	return (
		<>
			<FlexStartColumn>
				{showConfetti ? (
					<Confetti
						recycle={false}
						numberOfPieces={800}
						canvasRef={(null as unknown) as RefObject<HTMLCanvasElement>}
					/>
				) : null}
				<HackerDashBG>
					<FlexColumn>
						<Title fontSize="1.75rem">{STRINGS.HACKER_DASHBOARD_HEADER_TEXT}</Title>
						{loading ? null : (
							<>
								<ButtonOutline
									paddingLeft="4rem"
									paddingRight="4rem"
									width="auto"
									background={statusInfo.statusBG}
									glowColor="null">
									<CenterButtonText color={statusInfo.statusColor} fontSize="1.8rem">
										{statusInfo.status}
									</CenterButtonText>
								</ButtonOutline>
								<img
									src={statusInfo.img}
									height="200px"
									alt="Man wearing hoodie at holographic computer"
								/>
								<SmallCenteredText color="#3F3356" fontSize="1rem" margin="1.4rem">
									<span style={{ fontWeight: 'bold' }}>{statusInfo.boldText}</span>
									<br />
									{statusInfo.text}
								</SmallCenteredText>
							</>
						)}
						{statusInfo.actions.map(e => (
							<TextButton
								color="white"
								fontSize="1.4em"
								background={STRINGS.ACCENT_COLOR}
								glowColor="rgba(0, 0, 255, 0.67)"
								onClick={e.action}>
								{e.actionText}
							</TextButton>
						))}
					</FlexColumn>
				</HackerDashBG>
			</FlexStartColumn>
		</>
	);
};

export default HackerDash;
