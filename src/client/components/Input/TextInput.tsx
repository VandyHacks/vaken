import React from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';

export interface Props {
	background?: string;
	className?: string;
	color?: string;
	fontSize?: string;
	id?: string;
	list?: string;
	onBlur?: () => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	pattern?: string;
	placeholder?: string;
	required?: boolean;
	type?: string;
	value: string;
}

export const Input = styled.input`
	background: ${({ background = 'transparent' }: Props): string => background};
	padding: 0.75rem;
	width: 17rem;
	border: none;
	font-size: ${({ fontSize = '1em' }: Props): string => fontSize};
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

export default Input;
