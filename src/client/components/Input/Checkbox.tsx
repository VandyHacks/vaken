import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { AppField } from '../../routes/application/ApplicationConfig';
import { fieldValue } from '../../routes/application/Application';

interface Props extends AppField {
	options?: string[];
	children?: React.ReactNode;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value: fieldValue;
	name: string;
}

const Checkbox: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const { options = ['default'], name = '', value = [] } = props;
	let answers: string[] = value instanceof Array ? value : [];

	return (
		<fieldset>
			{options.map((option: string) => {
				return (
					<label key={option} htmlFor={option}>
						{option}
						<input checked={answers.includes(option)} type="checkbox" id={option} />
					</label>
				);
			})}
		</fieldset>
	);
};

export default Checkbox;
