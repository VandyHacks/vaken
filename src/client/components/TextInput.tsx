import React from 'react';
import styled from 'styled-components';
import STRINGS from '../assets/strings.json';

interface Props {
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: () => void;
	color?: string;
	placeholder?: string;
	type?: string;
	value: string;
	valid?: boolean;
}
interface State {}

const TextInputStyles = styled.input`
	width: 17rem;
	border: none;
	border-bottom: ${(props: Props) => (props.valid ? 'none' : '2px solid red')};
	font-size: 1.4rem;
	color: ${STRINGS.DARK_TEXT_COLOR};
	::placeholder {
		color: ${STRINGS.LIGHT_TEXT_COLOR};
	}

	&:focus {
		outline: none;
	}
`;

const TextInput = (props: Props): JSX.Element => {
	return <TextInputStyles {...props} />;
};

export default TextInput;
export { TextInputStyles };
