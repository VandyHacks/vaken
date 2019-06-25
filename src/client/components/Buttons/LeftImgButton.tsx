import React from 'react';
import { Button, ButtonProps, RightPaddedImg, CenterButtonText } from './Buttons';
import { FlexRow } from '../Containers/FlexContainers';

interface Props extends ButtonProps {
	background?: string;
	color?: string;
	glowColor?: string;
	img: string;
	imgAlt: string;
	onClick?: () => void;
	text: string;
}

const LeftImgButton = (props: Props): JSX.Element => {
	const { img, imgAlt, color, text, onClick, ...ImgButtonProps } = props;
	return (
		<Button {...ImgButtonProps} onClick={onClick}>
			{/* Edge case of centering icons */}
			<FlexRow height="min-content" width="min-content">
				<RightPaddedImg src={img} alt={imgAlt} />
			</FlexRow>
			<CenterButtonText color={color}>{text}</CenterButtonText>
		</Button>
	);
};

export default LeftImgButton;
