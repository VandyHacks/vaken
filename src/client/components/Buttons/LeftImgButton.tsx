import React from 'react';
import { Button, RightPaddedImg, CenterButtonText } from './Buttons';
import { FlexRow } from '../Containers/FlexContainers';

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
			<FlexRow height="min-content" width="min-content" /* Edge case of centering icons */>
				<RightPaddedImg src={'/' + img} alt={imgAlt} />
			</FlexRow>
			<CenterButtonText color={color}>{text}</CenterButtonText>
		</Button>
	);
};

export default LeftImgButton;
