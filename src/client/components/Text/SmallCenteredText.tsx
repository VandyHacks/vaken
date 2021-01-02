import styled from 'styled-components';

export interface Props {
	/** Text color */
	color?: string;
	fontFamily?: string;
	fontSize?: string;
	fontWeight?: string;
	/** Margin applied to the top and bottom */
	margin?: string;
	/** The text to display inside the tag */
	children: React.ReactChild;
}

export const SmallCenteredText = styled.h1`
	font-family: ${({ fontFamily = "'Roboto', sans-serif" }: Props): string => fontFamily};
	font-weight: ${({ fontWeight = '300' }: Props): string => fontWeight};
	font-size: ${({ fontSize = '1.5rem' }: Props): string => fontSize};
	color: ${({ color = 'white' }: Props): string => color};
	margin: ${({ margin = '0' }: Props): string => margin} 0;
`;

export default SmallCenteredText;
