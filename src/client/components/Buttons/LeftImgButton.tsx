import React, { FC } from 'react';
import { Button, ButtonProps, RightPaddedImg, CenterButtonText } from './Buttons';
import { FlexRow } from '../Containers/FlexContainers';

export interface ImgButtonProps extends ButtonProps {
	/** `<img />` tag src attribute */
	img: string;
	/** `<img />` tag alt attribute */
	imgAlt: string;
}

const LeftImgButton: FC<ImgButtonProps> = ({
	img,
	imgAlt,
	color,
	children,
	onClick,
	...buttonProps
}: ImgButtonProps) => (
	<Button {...buttonProps} onClick={onClick}>
		{/* Edge case of centering icons */}
		<FlexRow height="min-content" width="min-content">
			<RightPaddedImg src={img} alt={imgAlt} />
		</FlexRow>
		<CenterButtonText color={color}>{children}</CenterButtonText>
	</Button>
);

export default LeftImgButton;
