import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { ApplicationStatus } from '../../generated/graphql';
import STRINGS from '../../assets/strings.json';

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
	generateColor?: (value: ApplicationStatus) => string;
	value: ApplicationStatus;
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
	border-radius: ${(props: StyledProps) => props.borderRadius || '8px'};
	width: ${(props: StyledProps) => props.width || '5rem'};
	text-transform: lowercase;

	&::first-letter {
		text-transform: capitalize;
	}
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
