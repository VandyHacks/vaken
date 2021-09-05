import React, { FC, ChangeEventHandler, TextareaHTMLAttributes } from 'react';
import styled from 'styled-components';
import * as STRINGS from '../../assets/strings';
import { StyleProps, InputProps } from './TextInput';

export const RawInput = styled.textarea`
	background: white;
	padding: 0.75rem;
	width: 100%;
	border: none;
	font-family: 'Roboto', sans-serif;
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

export interface Props extends InputProps {
	maxLength?: number;
}

export const Input: FC<Props> = ({ setState, value, maxLength, ...rest }) => {
	const onChange: ChangeEventHandler<HTMLTextAreaElement> = ({ currentTarget }) =>
		setState(currentTarget.value);

	// TODO: Remove any.
	/* eslint-disable @typescript-eslint/no-explicit-any */
	return (
		<RawInput
			maxLength={maxLength || STRINGS.TEXT_AREA_MAX_LENGTH}
			{...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
			value={value}
			onChange={onChange as any}
		/>
	);
};

export default Input;
