import React, { FC } from 'react';
import { Slider } from './Slider';
import { InputProps } from './TextInput';

/**
 * A slider with two options: 'Yes' and 'No'.
 * The `setState` param will be called with the string value which is clicked.
 * Passing a `value` prop that is not in `['Yes', 'No']` will result in an unset status.
 */
export const Boolean: FC<InputProps> = ({ ...rest }: InputProps) => (
	<Slider options={['Yes', 'No']} {...rest} />
);

export default Boolean;
