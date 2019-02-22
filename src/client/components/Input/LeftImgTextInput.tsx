import React from 'react';
import produce from 'immer';
import { RightPaddedImg, ButtonOutline } from '../Buttons/Buttons';
import TextInput, { Props as InputProps } from './TextInput';

interface Props extends InputProps {
	img: string;
	imgAlt: string;
}

const LeftImgTextInput = (props: Props): JSX.Element => {
	const { img, imgAlt } = props;

	return (
		<ButtonOutline>
			<RightPaddedImg src={img} alt={imgAlt} />
			<TextInput {...props} />
		</ButtonOutline>
	);
};

export default LeftImgTextInput;

// Copyright (c) 2019 Vanderbilt University
