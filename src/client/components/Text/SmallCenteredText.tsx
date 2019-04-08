import styled from 'styled-components';

interface Props {
	color?: string;
	margin?: string;
	fontSize?: string;
	fontFamily?: string;
	fontWeight?: string;
}

export const SmallCenteredText = styled.h1`
	font-family: ${({ fontFamily = "'Roboto', sans-serif" }: Props): string => fontFamily};
	font-weight: ${({ fontWeight = '300' }: Props): string => fontWeight};
	font-size: ${({ fontSize = '1.5rem' }: Props): string => fontSize};
	color: ${({ color = 'white' }: Props): string => color};
	margin: ${({ margin = '0' }: Props): string => margin};
`;

export default SmallCenteredText;

// Copyright (c) 2019 Vanderbilt University
