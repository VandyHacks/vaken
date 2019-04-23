import React from 'react';
import produce from 'immer';
import { RightPaddedImg, ButtonOutline } from '../Buttons/Buttons';
import TextInput, { Props as InputProps } from './TextInput';
import { checkValid, regexWrapper } from './helperFunctions';

interface Props extends InputProps {
	img: string;
	imgAlt: string;
	invalid?: boolean;
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
