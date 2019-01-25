import React from 'react';
import styled from 'styled-components';
import STRINGS from '../assets/strings.json';

const TextInputStyles = styled.input`
	width: 80%;
	border: none;
	border-bottom: 1px solid ${STRINGS.DARK_TEXT_COLOR};
	font-size: 1.6rem;
`;

interface Props {
	onChange?: () => void;
	color?: string;
	placeholder?: string;
	type?: string;
}
interface State {}

const TextInput = (props: Props): JSX.Element => {
	return <TextInputStyles {...props} />;
};

export default TextInput;
export { TextInputStyles };
