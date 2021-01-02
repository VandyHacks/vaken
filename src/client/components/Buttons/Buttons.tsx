import styled from 'styled-components';
import CSS from 'csstype';
import { ButtonHTMLAttributes } from 'react';
import { displayFlex } from '../Containers/FlexContainers';

export type LeftButtonTextProps = Pick<CSS.Properties, 'color' | 'fontSize'>;
export type CenterButtonTextProps = LeftButtonTextProps &
	Pick<CSS.Properties, 'fontWeight' | 'paddingLeft' | 'paddingRight'>;
export type ButtonProps = CenterButtonTextProps &
	Pick<
		CSS.Properties,
		| 'background'
		| 'height'
		| 'margin'
		| 'marginBottom'
		| 'marginLeft'
		| 'marginRight'
		| 'marginTop'
		| 'padding'
		| 'paddingBottom'
		| 'paddingTop'
		| 'width'
	> &
	ButtonHTMLAttributes<HTMLButtonElement> & {
		glowColor?: string;
		invalid?: boolean;
		enabled?: boolean;
	};

export const CenterButtonText = styled.div`
	${displayFlex}
	height: 100%;
	text-align: center;
	font-family: 'Roboto';
	font-size: ${({ fontSize }: CenterButtonTextProps) => fontSize || '1.4rem'};
	font-weight: ${({ fontWeight }: CenterButtonTextProps) => fontWeight || 'normal'};
	color: ${({ color }: CenterButtonTextProps) => color || 'black'};
	padding-left: ${({ paddingLeft }) => paddingLeft || 'unset'};
	padding-right: ${({ paddingRight }) => paddingRight || 'unset'};
`;

export const LeftButtonText = styled(CenterButtonText)`
	${displayFlex}
	align-items: flex-start;
	font-family: 'Roboto Condensed';
	font-size: ${({ fontSize }: LeftButtonTextProps) => fontSize || '1.4rem'};
	color: ${({ color }: LeftButtonTextProps) => color || 'black'};
`;

export const RightPaddedImg = styled.img`
	min-height: 16px;
	padding-right: 1rem;
`;

export const LeftPaddedImg = styled.img`
	padding-left: 1rem;
`;

export const Button = styled.button`
	${displayFlex}
	flex-flow: row;
	font-weight: ${({ fontWeight }: ButtonProps) => fontWeight || 400};
	height: ${({ height }: ButtonProps) => height || '3.2rem'};
	width: ${({ width }: ButtonProps) => width || '23.33rem'};
	padding: ${({ padding }: ButtonProps) => padding || 0};
	padding-bottom: ${({ paddingBottom }: ButtonProps) => paddingBottom || 0};
	padding-top: ${({ paddingTop }: ButtonProps) => paddingTop || 0};
	padding-left: ${({ paddingLeft }: ButtonProps) => paddingLeft || 0};
	padding-right: ${({ paddingRight }: ButtonProps) => paddingRight || 0};
	margin: ${({ margin }: ButtonProps) => margin || 0};
	margin-bottom: ${({ marginBottom = '1.6rem' }: ButtonProps) => marginBottom};
	margin-top: ${({ marginTop }: ButtonProps) => marginTop || 0};
	margin-left: ${({ marginLeft }: ButtonProps) => marginLeft || 0};
	margin-right: ${({ marginRight }: ButtonProps) => marginRight || 0};
	background: ${({ background = 'rgba(255, 255, 255, 1)' }: ButtonProps) => background};
	border-radius: 4px;
	cursor: pointer;
	border: none;

	&:hover {
		${({ invalid, glowColor }: ButtonProps) =>
			invalid
				? 'box-shadow: 0 0 20px red;'
				: `box-shadow: 0px 0px 30px 0px ${glowColor || 'rgba(255, 255, 255, 1)'};`}
	}

	&:focus {
		outline: none;
	}
`;

export const ButtonOutline = styled(Button.withComponent('div'))`
	justify-content: center;
	cursor: initial;

	${({ invalid }: ButtonProps) => (invalid ? 'box-shadow: 0 0 15px red;' : null)}

	img {
		padding-left: 2rem;
	}
`;
