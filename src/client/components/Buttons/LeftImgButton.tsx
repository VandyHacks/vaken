import React from 'react';
import styled from 'styled-components';
import { Button, RightPaddedImg, ButtonText } from './Buttons';
import { FlexRow } from '../Containers/FlexContainers';
import STRINGS from '../../assets/strings.json';

interface Props {
	img: string;
	imgAlt: string;
	text: string;
	color?: string;
	background?: string;
	glowColor?: string;
}

const LeftImgButton = (props: Props): JSX.Element => {
	const { img, text, imgAlt, color, background, glowColor } = props;
	return (
		<Button background={background} glowColor={glowColor}>
			<FlexRow /* Edge case of centering icons */>
				<RightPaddedImg src={'/' + img} alt={imgAlt} />
			</FlexRow>
			<ButtonText color={color}>{text}</ButtonText>
		</Button>
	);
};

export default LeftImgButton;
