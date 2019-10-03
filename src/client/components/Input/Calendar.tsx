import React, { FC, FormEventHandler } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';
import { InputProps } from './TextInput';

export const StyledCalInput = styled.input`
	padding: 0.75rem;
	width: 17rem;
	border: none;
	font-size: 1em;
	font-family: 'Roboto', sans-serif;
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

export const CalendarInput: FC<InputProps> = ({ setState, ...rest }: InputProps) => {
	const onChange: FormEventHandler<HTMLInputElement> = ({ currentTarget: { value } }) =>
		setState(value);

	return <StyledCalInput type="date" {...rest} onChange={onChange} />;
};

export default CalendarInput;
