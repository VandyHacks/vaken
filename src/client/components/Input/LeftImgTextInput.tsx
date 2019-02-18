import React from 'react';
import produce from 'immer';
import { RightPaddedImg, ButtonOutline } from '../Buttons/Buttons';
import TextInput from './TextInput';

interface Props {
	img: string;
	imgAlt: string;
	onBlur: () => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	valid: boolean;
	value: string;
	placeholder: string;
	type?: string;
}

const LeftImgTextInput = (props: Props): JSX.Element => {
	const { img, imgAlt, type = 'text' } = props;

	return (
		<ButtonOutline>
			<RightPaddedImg src={img} alt={imgAlt} />
			<TextInput {...props} type={type} />
		</ButtonOutline>
	);
};

export default LeftImgTextInput;

// Copyright (c) 2019 Vanderbilt University
