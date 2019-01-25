import React, { Component } from 'react';
import styled from 'styled-components';
import STRINGS from '../assets/strings.json';

const TextInput = styled.input`
	width: 80%;
	border: none;
	border-bottom: 1px solid ${STRINGS.DARK_TEXT_COLOR};
	font-size: 1.6rem;
`;

interface Props {
	type: string;
}
interface State {
	text: string;
}

export default class Textbox extends Component<Props, State> {
	public constructor(props: Props) {
		super(props);
		this.state = {
			text: '',
		};
	}

	public render() {
		return <TextInput />;
	}
}
