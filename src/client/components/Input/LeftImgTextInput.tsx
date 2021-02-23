import React from 'react';
import { RightPaddedImg, ButtonOutline } from '../Buttons/Buttons';
import TextInput, { InputProps } from './TextInput';
import { regexWrapper } from './helperFunctions';

export interface Props extends InputProps {
	img: string;
	imgAlt: string;
	invalid?: boolean;
	/** Regex pattern for validation */
	pattern?: string;
}

const LeftImgTextInput = (props: Props): JSX.Element => {
	const { img, imgAlt, pattern = '.+', value, invalid, ...rest } = props;
	return (
		<ButtonOutline invalid={invalid || !regexWrapper(pattern)(value)}>
			<RightPaddedImg src={img} alt={imgAlt} />
			<TextInput value={value} {...rest} />
		</ButtonOutline>
	);
};

export default LeftImgTextInput;
