import styled from 'styled-components';
import React, { FC } from 'react';
import { Button, CenterButtonText, ButtonProps } from './Buttons';

export const StyledLoginBtn = styled(Button)`
	background: ${({ background }: ButtonProps) => background || 'white'};
	color: ${({ background }: ButtonProps) => background || 'black'};
	flex-shrink: 0;
	font-family: 'Roboto';
	font-size: 1rem;
	outline: 0 !important;

	&:hover,
	&:focus,
	&:active {
		box-shadow: 0px 0px 20px 0px
			${({ glowColor = 'RGBA(0, 0, 0, 255, 0.67)' }: ButtonProps) => glowColor};
	}
`;

const TextButton: FC<ButtonProps> = ({
	children,
	onClick,
	fontWeight,
	fontSize,
	color,
	...props
}: ButtonProps) => (
	<StyledLoginBtn onClick={onClick} {...props}>
		<CenterButtonText {...{ color, fontSize, fontWeight }}>{children}</CenterButtonText>
	</StyledLoginBtn>
);

export default TextButton;
