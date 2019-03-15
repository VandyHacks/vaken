import React from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';

export interface Props {
	color?: string;
	value: string;
	required?: boolean;
	placeholder?: string;
	type?: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: () => void;
	id?: string;
	className?: string;
	list?: string;
}

export const StyledCalInput = styled.input`
	padding: 0.75rem;
	width: 17rem;
	border: none;
	font-size: 1em;
	border-bottom: 2px solid transparent;
	color: ${STRINGS.DARK_TEXT_COLOR};
	::placeholder {
		color: ${STRINGS.LIGHT_TEXT_COLOR};
	}

	:invalid {
		border-bottom: 2px solid red;
	}

	&:focus {
		outline: none;
	}
`;

export const CalendarInput = (props: Props): JSX.Element => {
	return <StyledCalInput type="date" {...props} />;
};

export default CalendarInput;

// Copyright (c) 2019 Vanderbilt University
