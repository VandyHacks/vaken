import styled from 'styled-components';

interface Props {
	color?: string;
	fontFamily?: string;
	fontSize?: string;
	fontWeight?: string;
	margin?: string;
	textAlign?: string;
}

/**
 * Title is a set of defaults used for titles.
 * @param {Props} props - color, margin, fontSize, fontFamily, fontWeight
 * @return {JSX.Element} HOC styling child text
 */
export const Title = styled.h1`
	font-family: ${(props: Props) => props.fontFamily || "'Roboto', sans-serif"};
	font-weight: ${(props: Props) => props.fontWeight || 500};
	font-size: ${(props: Props) => props.fontSize || '2.5rem'};
	color: ${(props: Props) => props.color || 'black'};
	margin: ${(props: Props) => props.margin || '1.5rem'};
	margin-top: 0;
	${(props: Props) => (props.textAlign ? `text-align: ${props.textAlign};` : null)};
`;

export default Title;
