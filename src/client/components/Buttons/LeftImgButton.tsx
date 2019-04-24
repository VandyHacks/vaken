import React from 'react';
import { Button, ButtonProps, RightPaddedImg, CenterButtonText } from './Buttons';
import { FlexRow } from '../Containers/FlexContainers';

interface Props extends ButtonProps {
	img: string;
	imgAlt: string;
	text: string;
	color?: string;
	background?: string;
	glowColor?: string;
	onClick?: () => void;
}

const LeftImgButton = (props: Props): JSX.Element => {
	const { img, imgAlt, color, text, onClick, ...ButtonProps } = props;
	return (
		<Button {...ButtonProps} onClick={onClick}>
			<FlexRow height="min-content" width="min-content">
				<RightPaddedImg src={img} alt={imgAlt} />
			</FlexRow>
			<CenterButtonText color={color}>{text}</CenterButtonText>
		</Button>
	);
};

export default LeftImgButton;

// Copyright (c) 2019 Vanderbilt University
