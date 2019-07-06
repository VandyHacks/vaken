import React, { FC, FormEventHandler, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';

export interface StyleProps extends InputHTMLAttributes<HTMLInputElement> {
	background?: string;
	fontSize?: string;
}

export interface InputProps extends StyleProps {
	setState: (value: string) => void;
	value: string;
}

export const RawInput = styled.input`
	background: ${({ background = 'transparent' }: StyleProps): string => background};
	padding: 0.75rem;
	width: 17rem;
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

export const Input: FC<InputProps> = ({ setState, ...rest }: InputProps) => {
	const onChange: FormEventHandler<HTMLInputElement> = ({ currentTarget: { value } }) =>
		setState(value);

	return <RawInput {...rest} onChange={onChange} />;
};

export default Input;
