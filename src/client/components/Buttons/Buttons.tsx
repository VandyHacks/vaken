import styled from 'styled-components';
import { displayFlex } from '../Containers/FlexContainers';

interface ButtonTextProps {
	fontSize?: string;
	color?: string;
	fontWeight?: string;
}

export interface ButtonProps {
	glowColor?: string;
	background?: string;
	invalid?: boolean;
	width?: string;
}

export const CenterButtonText = styled.div`
	${displayFlex}
	height: 100%;
	text-align: center;
	font-family: 'Roboto';
	font-size: ${({ fontSize = '1.4rem' }: ButtonTextProps): string => fontSize};
	font-weight: ${({ fontWeight = 'normal' }: ButtonTextProps): string => fontWeight};
	color: ${({ color = 'black' }: ButtonTextProps): string => color};
`;

export const LeftButtonText = styled(CenterButtonText)`
	${displayFlex}
	align-items: flex-start;
	font-family: 'Roboto Condensed';
	font-size: ${({ fontSize = '1.4rem' }: ButtonTextProps): string => fontSize};
	color: ${({ color = 'black' }: ButtonTextProps): string => color};
`;

export const RightPaddedImg = styled.img`
	padding-right: 1rem;
`;

export const LeftPaddedImg = styled.img`
	padding-left: 1rem;
`;

export const Button = styled.button`
	${displayFlex}
	flex-flow: row;
	font-weight: 400;
	width: ${({ width = '23.33rem' }: ButtonProps): string => width};
	height: 3.2rem;
	margin-bottom: 1.6rem;
	background: ${({ background = 'rgba(255, 255, 255, 1)' }: ButtonProps): string => background};
	border-radius: 1rem;
	cursor: pointer;
	border: none;

	&:hover {
		${({ invalid, glowColor = 'rgba(255, 255, 255, 1)' }: ButtonProps): string =>
			invalid ? 'box-shadow: 0 0 20px red;' : `box-shadow: 0px 0px 30px 0px ${glowColor}`}
	}

	&:focus {
		outline: none;
	}
`;

export const ButtonOutline = styled(Button.withComponent('div'))`
	justify-content: center;
	cursor: initial;

	${({ invalid }: ButtonProps): string => (invalid ? 'box-shadow: 0 0 15px red;' : '')}

	img {
		padding-left: 2rem;
	}
`;

// Copyright (c) 2019 Vanderbilt University
