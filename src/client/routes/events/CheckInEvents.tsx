import React, { FunctionComponent, useState, useEffect, RefObject } from 'react';
import styled from 'styled-components';
import TextButton, { StyledLoginBtn } from '../../components/Buttons/TextButton';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { FlexColumn, FlexStartColumn } from '../../components/Containers/FlexContainers';
import { Title } from '../../components/Text/Title';
import STRINGS from '../../assets/strings.json';
import { ButtonOutline, CenterButtonText } from '../../components/Buttons/Buttons';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import { useMyStatusQuery } from '../../generated/graphql';

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

	useEffect((): void => {
		if (data && data.me && data.me.__typename === 'Hacker') {
			console.log(data.me.status);
		}
	}, [data]);

	return (
		<>
			<FlexStartColumn>
				<HackerDashBG>
					<FlexColumn>
						<Title fontSize="1.75rem">{STRINGS.HACKER_DASHBOARD_HEADER_TEXT}</Title>
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
							</>
						)}
					</FlexColumn>
				</HackerDashBG>
			</FlexStartColumn>
		</>
	);
};

export default CheckInEvent;
