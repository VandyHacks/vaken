import styled from 'styled-components';

interface Props {
	color?: string;
	margin?: string;
	fontSize?: string;
	fontFamily?: string;
	fontWeight?: string;
}

export const Title = styled.h1`
	font-family: ${(props: Props) => props.fontFamily || "'Roboto', sans-serif"};
	font-weight: ${(props: Props) => props.fontWeight || 500};
	font-size: ${(props: Props) => props.fontSize || '2.5rem'};
	color: ${(props: Props) => props.color || 'black'};
	margin: ${(props: Props) => props.margin || '1.5rem'};
`;

export default Title;
