import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';

interface Props {
	fontColor?: string;
	fontFamily?: string;
	fontSize?: string;
    fontWeight?: number;
    textAlign?: string;
    borderRadius?: string;
    width?: string;
}

interface ComponentProps extends Props {
    value: any;
	generateColor?: (value: any) => string;
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
	text-align: ${(props: StyledProps) => props.textAlign || "center"};
	border-radius: ${(props: StyledProps) => props.borderRadius || "1rem"};
	width: ${(props: StyledProps) => props.width || "5rem"};
`;

export const Status: FunctionComponent<ComponentProps> = (props: ComponentProps): JSX.Element => {
	const { value, generateColor } = props;

	// check if it exists before calling
	return typeof generateColor === 'function' ? (
		<StyledDiv {...props} backgroundColor={generateColor(value)}>
			{value}
		</StyledDiv>
	) : (
		<StyledDiv {...props}>{value}</StyledDiv>
	);
};

export default Status;

// Copyright (c) 2019 Vanderbilt University