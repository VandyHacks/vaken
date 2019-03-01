import React, { forwardRef, RefForwardingComponent } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';
import { fieldValue } from '../../routes/application/Application';

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

export const Input = styled.input`
	width: 17rem;
	border: none;
	font-size: 1.4rem;
	color: ${STRINGS.DARK_TEXT_COLOR};
	::placeholder {
		color: ${STRINGS.LIGHT_TEXT_COLOR};
	}

	:invalid {
		border-bottom: 2px solid red;
	}

	&:focus {
		outline: none;
		border: none;
	}
`;

export default Input;

// Copyright (c) 2019 Vanderbilt University
