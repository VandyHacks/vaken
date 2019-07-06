import React, { FC } from 'react';
import { Button, ButtonProps, RightPaddedImg, CenterButtonText } from './Buttons';
import { FlexRow } from '../Containers/FlexContainers';

interface ImgButtonProps extends ButtonProps {
	img: string;
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
		<CenterButtonText {...color}>{children}</CenterButtonText>
	</Button>
);

export default LeftImgButton;
