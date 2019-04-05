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
	fontSize?: string;
	pattern?: string;
	background?: string;
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

// Copyright (c) 2019 Vanderbilt University
