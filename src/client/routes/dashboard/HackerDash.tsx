import React, { FunctionComponent, useState, useEffect, RefObject } from 'react';
import styled from 'styled-components';
import { Button } from '../../components/Buttons/Button';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { FlexColumn, FlexStartColumn } from '../../components/Containers/FlexContainers';
import { Title } from '../../components/Text/Title';
import STRINGS from '../../assets/strings.json';
import { ButtonOutline, CenterButtonText } from '../../components/Buttons/Buttons';
import applicationStatusSVG from '../../assets/img/application_status.svg';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import {
	ApplicationStatus,
	useMyStatusQuery,
	useConfirmMySpotMutation,
	useDeclineMySpotMutation,
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
		img: applicationStatusSVG,
		status: 'Not Started',
		statusBG: STRINGS.APPLICATION_INCOMPLETE_STATUSBG,
		statusColor: STRINGS.APPLICATION_INCOMPLETE_STATUSCOLOR,
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
		img: applicationStatusSVG,
		status: 'Incomplete',
		statusBG: STRINGS.APPLICATION_INCOMPLETE_STATUSBG,
		statusColor: STRINGS.APPLICATION_INCOMPLETE_STATUSCOLOR,
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
		img: applicationStatusSVG,
		status: 'Submitted',
		statusBG: STRINGS.APPLICATION_COMPLETE_STATUSBG,
		statusColor: STRINGS.APPLICATION_COMPLETE_STATUSCOLOR,
		text: "You may update your responses at any time by re-visiting the application.'",
	},
	[ApplicationStatus.Confirmed]: {
		actions: [
			{
				action: () => void window.open('https://discord.gg/MbbfBWW', '_blank'),
				actionText: 'Join our Discord',
			},
		],
		boldText: `Whoo hoo! We'll see you ${STRINGS.START_DAY}! Don't forget to join the Discord!`,
		img: applicationStatusSVG,
		status: 'Confirmed',
		statusBG: STRINGS.APPLICATION_COMPLETE_STATUSBG,
		statusColor: STRINGS.APPLICATION_COMPLETE_STATUSCOLOR,
		text: "If you don't have a team, you can form one when you join the Discord!",
	},
	[ApplicationStatus.Accepted]: {
		actions: [
			{
				action: () => void undefined, // Overridden in HackerDash component
				actionText: 'Confirm your spot',
			},
			{
				action: () => void undefined, // Overridden in HackerDash component
				actionText: 'Decline your spot',
			},
		],
		boldText: "You've been accepted!",
		img: applicationStatusSVG,
		status: 'Accepted',
		statusBG: STRINGS.APPLICATION_COMPLETE_STATUSBG,
		statusColor: STRINGS.APPLICATION_COMPLETE_STATUSCOLOR,
		text: "Confirm your spot to let us know you'll be coming",
	},
	[ApplicationStatus.Declined]: {
		actions: [],
		boldText: "You've declined.",
		img: applicationStatusSVG,
		status: 'Declined',
		statusBG: STRINGS.APPLICATION_DECLINED_STATUSBG,
		statusColor: STRINGS.APPLICATION_DECLINED_STATUSCOLOR,
		text: `Changed your mind? Email ${STRINGS.HELP_EMAIL}`,
	},
	[ApplicationStatus.Rejected]: {
		actions: [],
		boldText: "Unfortunately, we couldn't offer you a spot this year :(",
		img: applicationStatusSVG,
		status: 'Denied',
		statusBG: STRINGS.APPLICATION_INCOMPLETE_STATUSBG,
		statusColor: STRINGS.APPLICATION_INCOMPLETE_STATUSCOLOR,
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
		a {
			width: 100%;
		}
	}

	img {
		display: block;
		height: 200px;
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
								<img src={statusInfo.img} alt={`${STRINGS.APPLICATION_STATUS_SVG_ALT_TEXT}`} />
								<SmallCenteredText
									color={`${STRINGS.DARK_TEXT_COLOR}`}
									fontSize="1rem"
									margin="1.4rem">
									<>
										<p style={{ fontWeight: 'bold' }}>{statusInfo.boldText}</p>
										<br />
										{statusInfo.text}
									</>
								</SmallCenteredText>
							</>
						)}
						{statusInfo.actions.map(e => (
							<Button key={e.actionText} large long onClick={e.action}>
								{e.actionText}
							</Button>
						))}
					</FlexColumn>
				</HackerDashBG>
			</FlexStartColumn>
		</>
	);
};

export default HackerDash;
