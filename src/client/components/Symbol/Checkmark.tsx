import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';
import activeCheckmark from '../../assets/img/active_checkmark.svg';
import inactiveCheckmark from '../../assets/img/inactive_checkmark.svg';

const StyledDiv = styled('div')`
	vertical-align: middle;
`;

interface Props {
	color?: string;
	value: boolean;
	width?: string;
	height?: string;
}

export const Checkmark: FunctionComponent<Props> = (props: Props): JSX.Element => {
	return (
		<StyledDiv>
			<svg
				width={props.width || '1rem'}
				height={props.height || '1rem'}
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg">
				{props.value ? (
					<>
						<path
							d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
							fill={props.color || STRINGS.ACCENT_COLOR}
						/>
						<path
							d="M10.329 5.83928C10.5587 5.60956 10.9312 5.60956 11.1609 5.83928C11.3906 6.069 11.3906 6.44145 11.1609 6.67117L7.63147 10.2006C7.40175 10.4303 7.0293 10.4303 6.79958 10.2006L4.83879 8.2398C4.60907 8.01008 4.60907 7.63763 4.83879 7.40791C5.06851 7.17819 5.44096 7.17819 5.67068 7.40791L7.21552 8.95275L10.329 5.83928Z"
							fill="white"
						/>
					</>
				) : (
					<path
						d="M15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8Z"
						fill="white"
						stroke={props.color || STRINGS.ACCENT_COLOR}
					/>
				)}
			</svg>
		</StyledDiv>
	);
};

// const Checkmark = styled('div')`
//     ${({ value }: Props) =>
//     value
//         ? `background-color: ${STRINGS.DARK_TEXT_COLOR}`
//         : `background-color: ${STRINGS.ACCENT_COLOR}`}
//     height: 1.5rem;
//     width: 1.5rem;
//     background-color: ${STRINGS.ACCENT_COLOR};
//     border-radius: 50%;
//     display: inline-block;
// `;

export default Checkmark;

// Copyright (c) 2019 Vanderbilt University
