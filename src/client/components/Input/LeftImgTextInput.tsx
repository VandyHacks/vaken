import React from 'react';
import { RightPaddedImg, ButtonOutline } from '../Buttons/Buttons';
import TextInput from './TextInput';

interface Props {
	img: string;
	imgAlt: string;
	validationFn: () => void;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	isValid: boolean;
	value: string;
	placeholder: string;
	type?: string;
}

const LeftImgTextInput = (props: Props): JSX.Element => {
	const { img, validationFn, onChange, isValid, placeholder, type, value, imgAlt } = props;
	return (
		<ButtonOutline>
			<RightPaddedImg src={'/' + img} alt={imgAlt} />
			<TextInput
				placeholder={placeholder}
				type={type || 'text'}
				value={value}
				valid={isValid}
				onChange={onChange}
				onBlur={validationFn}
			/>
		</ButtonOutline>
	);
};

export default LeftImgTextInput;
