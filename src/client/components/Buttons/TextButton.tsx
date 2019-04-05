import styled from 'styled-components';
import React from 'react';
import { Button, CenterButtonText, ButtonProps } from './Buttons';

interface Props extends ButtonProps {
	background?: string;
	color?: string;
	text: string;
	glowColor?: string;
	fontSize?: string;
	onClick?: () => void;
}

interface StyleProps {
	background?: string;
	color?: string;
	glowColor?: string;
}

export const StyledLoginBtn = styled(Button)`
	background: ${({ background = 'white' }: StyleProps): string => background};
	margin-top: 1.6rem;
	margin-bottom: 0.5rem;
	color: ${({ background = 'black' }: StyleProps): string => background};
	flex-shrink: 0;
	font-family: 'Roboto';
	font-size: 1rem;
	outline: 0 !important;

	&:hover,
	&:focus,
	&:active {
		box-shadow: 0px 0px 20px 0px
			${({ glowColor = 'RGBA(0, 0, 0, 255, 0.67)' }: StyleProps): string => glowColor};
	}
`;

const TextButton = (props: Props): JSX.Element => {
	const { text } = props;

	return (
		<StyledLoginBtn {...props}>
			<CenterButtonText {...props}>{text}</CenterButtonText>
		</StyledLoginBtn>
	);
};

export default TextButton;

// Copyright (c) 2019 Vanderbilt University
