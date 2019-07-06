import React, { FC } from 'react';
import { Slider } from './Slider';
import { InputProps } from './TextInput';

export const Boolean: FC<InputProps> = ({ value, ...rest }: InputProps) => (
	<Slider options={['Yes', 'No']} value={value ? 'Yes' : 'No'} {...rest} />
);

export default Boolean;
