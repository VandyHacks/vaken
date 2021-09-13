import React, { FC, useContext, useEffect } from 'react';
import { VandyStudentContext } from '../../routes/application/VandyStudentContext';
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

export const VandyOnlyBoolean: FC<InputProps> = (props: InputProps) => {
	const { vandyStatus, setVandyStatus } = useContext(VandyStudentContext);
	const { setState } = props;
	useEffect(() => {
		switch (vandyStatus) {
			case 0: {
				setState('No');
				break;
			}
			case 1: {
				setState('');
				if (setVandyStatus) setVandyStatus(true);
				break;
			}
			default: {
				// Do nothing for case 2, prevents re-renders from setting state to '';
				break;
			}
		}
	}, [setState, vandyStatus, setVandyStatus]);

	return vandyStatus ? <Boolean {...props} /> : null;
};

export default Boolean;
