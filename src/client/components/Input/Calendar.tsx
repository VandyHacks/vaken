import React from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';
import { InputProps } from './TextInput';

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

export const CalendarInput = (props: InputProps): JSX.Element => (
	<StyledCalInput type="date" {...props} />
);

export default CalendarInput;
