import styled from 'styled-components';

interface Props {
	color?: string;
	margin?: string;
	fontSize?: string;
	fontFamily?: string;
	fontWeight?: string;
}

export const SmallCenteredText = styled.h1`
	font-family: ${(props: Props) => props.fontFamily || "'Roboto', sans-serif"};
	font-weight: ${(props: Props) => props.fontWeight || 300};
	font-size: ${(props: Props) => props.fontSize || '1.5rem'};
	color: ${(props: Props) => props.color || 'white'};
	margin: ${(props: Props) => props.margin || '0'};
`;

export default SmallCenteredText;
