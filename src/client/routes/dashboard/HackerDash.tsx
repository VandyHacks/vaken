import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import TextButton from '../../components/Buttons/TextButton';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { FlexColumn, FlexStartColumn } from '../../components/Containers/FlexContainers';
import Title from '../../components/Text/Title';
import STRINGS from '../../assets/strings.json';
import { ButtonOutline, CenterButtonText } from '../../components/Buttons/Buttons';
import applicationIncompleteSVG from '../../assets/img/application_incomplete.svg';
import SmallCenteredText from '../../components/Text/SmallCenteredText';

interface Props {}

export const HackerDash: FunctionComponent = (): JSX.Element => {
	return (
		<>
			<FlexStartColumn>
				<FloatingPopup
					borderRadius="1rem"
					height="min-content"
					width="36rem"
					backgroundOpacity="1"
					padding="1.5rem">
					<FlexColumn>
						<Title fontSize="1.8rem">{STRINGS.HACKER_DASHBOARD_HEADER_TEXT}</Title>
						<ButtonOutline background="#FBE4E8" glowColor="#FBE4E8">
							<CenterButtonText color="#FF647C" fontWeight="bold" fontSize="1.8rem">
								INCOMPLETE
							</CenterButtonText>
						</ButtonOutline>
						<img src={applicationIncompleteSVG} alt="Man wearing hoodie at holographic computer" />
						<SmallCenteredText color="#3F3356" fontSize="1rem" margin="1.4rem">
							<span style={{ fontWeight: 'bold' }}>You still need to finish your application.</span>
							<br />
							The deadline is January 1, 2020 at 11:59 pm (EST).
						</SmallCenteredText>
						<Link style={{ textDecoration: 'none' }} to="/application">
							<TextButton
								color="white"
								fontSize="1.4em"
								background={STRINGS.ACCENT_COLOR}
								text="Complete your application"
								glowColor="rgba(0, 0, 255, 0.67)"
							/>
						</Link>
					</FlexColumn>
				</FloatingPopup>
			</FlexStartColumn>
		</>
	);
};

export default HackerDash;
