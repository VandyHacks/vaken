import styled from 'styled-components';
import { Link, LinkProps } from 'react-router-dom';

export interface Props extends LinkProps {
	color?: string;
	fontFamily?: string;
	fontSize?: string;
	fontWeight?: number;
	glowColor?: string;
	textDecoration?: string;
}

const TextLink = styled(Link)`
	font-family: ${(props: Props) => props.fontFamily || "'Roboto Condensed'"};
	font-size: ${(props: Props) => props.fontSize || '1rem'};
	font-weight: ${(props: Props) => props.fontWeight || 500};
	color: ${(props: Props) => props.color || 'black'};
	text-decoration: ${(props: Props) => props.textDecoration || 'none'};
	&:hover,
	&:focus,
	&:active {
		text-shadow: 0px 0px 20px ${({ glowColor }: Props) => glowColor || 'RGBA(255, 255, 255, 0.67)'};
	}
`;

export default TextLink;
