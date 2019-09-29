import React, { FC, ChangeEventHandler } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';
import { StyleProps, InputProps } from './TextInput';

export const RawInput = styled.textarea`
	background: white;
	padding: 0.75rem;
	width: 100%;
	border: none;
	font-size: ${({ fontSize = '1em' }: StyleProps): string => fontSize};
	color: ${STRINGS.DARK_TEXT_COLOR};
	::placeholder {
		color: ${STRINGS.LIGHT_TEXT_COLOR};
	}

	:invalid {
		box-shadow: 0 0 5px red;
	}

	&:focus {
		outline: none;
	}
`;

export const Input: FC<InputProps> = ({ setState, value, ...rest }) => {
	const onChange: ChangeEventHandler<HTMLTextAreaElement> = ({ currentTarget }) =>
		setState(currentTarget.value);

	// TODO: Remove any.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return <RawInput {...(rest as any)} value={value} onChange={onChange as any} />;
};

export default Input;
