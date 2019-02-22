import styled from 'styled-components';
import { displayFlex } from '../Containers/FlexContainers';

interface ButtonTextProps {
	fontSize?: string;
	color?: string;
	fontWeight?: string;
}

interface ButtonProps {
	glowColor?: string;
	background?: string;
}

export const CenterButtonText = styled.div`
	${displayFlex}
	height: 100%;
	font-family: 'Roboto';
	font-size: ${(props: ButtonTextProps) => props.fontSize || '1.4rem'};
	font-weight: ${(props: ButtonTextProps) => props.fontWeight || 'normal'};
	color: ${(props: ButtonTextProps) => props.color || 'black'};
`;

export const LeftButtonText = styled(CenterButtonText)`
	${displayFlex}
	align-items: flex-start;
	font-family: 'Roboto Condensed';
	font-size: ${(props: ButtonTextProps) => props.fontSize || '1.4rem'};
	color: ${(props: ButtonTextProps) => props.color || 'black'};
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
	width: 23.33rem;
	height: 3.2rem;
	margin-bottom: 1.6rem;
	background: ${(props: ButtonProps) => props.background || 'rgba(255, 255, 255, 1)'};
	border-radius: 1rem;
	cursor: pointer;
	border: none;

	&:hover {
		box-shadow: 0px 0px 30px 0px
			${(props: ButtonProps) => props.glowColor || 'rgba(255, 255, 255, 1)'};
	}

	&:focus {
		outline: none;
	}
`;

export const ButtonOutline = styled(Button.withComponent('div'))`
	justify-content: flex-start;
	cursor: initial;

	img {
		padding-left: 2rem;
	}
`;

// Copyright (c) 2019 Vanderbilt University
