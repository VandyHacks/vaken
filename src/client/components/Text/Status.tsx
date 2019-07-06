import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';
import { HackerStatus } from '../../contexts/TableContext';

interface Props {
	borderRadius?: string;
	fontColor?: string;
	fontFamily?: string;
	fontSize?: string;
	fontWeight?: number;
	textAlign?: string;
	width?: string;
}

interface ComponentProps extends Props {
	generateColor?: (value: HackerStatus) => string;
	value: HackerStatus;
}

interface StyledProps extends Props {
	backgroundColor?: string;
}

const StyledDiv = styled('div')`
	font-family: ${(props: StyledProps) => props.fontFamily || "'Roboto Condensed'"};
	font-size: ${(props: StyledProps) => props.fontSize || '1rem'};
	font-weight: ${(props: StyledProps) => props.fontWeight || 500};
	color: ${(props: StyledProps) => props.fontColor || 'white'};
	background-color: ${(props: StyledProps) => props.backgroundColor || STRINGS.ACCENT_COLOR};
	text-align: ${(props: StyledProps) => props.textAlign || 'center'};
	border-radius: ${(props: StyledProps) => props.borderRadius || '1rem'};
	width: ${(props: StyledProps) => props.width || '5rem'};
`;

export const Status: FunctionComponent<ComponentProps> = ({
	value,
	generateColor,
	...props
}: ComponentProps): JSX.Element => (
	<StyledDiv {...props} backgroundColor={generateColor && generateColor(value)}>
		{value}
	</StyledDiv>
);

export default Status;
