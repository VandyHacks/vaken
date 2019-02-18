import styled from 'styled-components';
import { Link } from 'react-router-dom';

interface Props {
	color?: string;
	fontFamily?: string;
	fontSize?: string;
	fontWeight?: number;
	textDecoration?: string;
}

const TextLink = styled(Link)`
	font-family: ${(props: Props) => props.fontFamily || "'Roboto Condensed'"};
	font-size: ${(props: Props) => props.fontSize || '1rem'};
	font-weight: ${(props: Props) => props.fontWeight || 500};
	color: ${(props: Props) => props.color || 'black'};
	text-decoration: ${(props: Props) => props.textDecoration || 'none'};
`;

export default TextLink;

// Copyright (c) 2019 Vanderbilt University
