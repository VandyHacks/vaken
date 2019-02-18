import styled from 'styled-components';
import React from 'react';
import { Button, CenterButtonText } from './Buttons';

interface Props {
	background?: string;
	color?: string;
	text: string;
	glowColor?: string;
	fontSize?: string;
}

interface StyleProps {
	background?: string;
	color?: string;
	glowColor?: string;
}

export const StyledLoginBtn = styled(Button)`
	background: ${(props: StyleProps) => props.background || 'white'};
	margin-top: 1.6rem;
	margin-bottom: 0.5rem;
	color: ${(props: StyleProps) => props.background || 'black'};
	flex-shrink: 0;
	font-family: 'Roboto';
	font-size: 1rem;

	&:hover,
	&:focus {
		box-shadow: 0px 0px 20px 0px
			${(props: StyleProps) => props.glowColor || 'RGBA(0, 0, 0, 255, 0.67)'};
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
