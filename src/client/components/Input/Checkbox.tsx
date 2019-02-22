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

const PrettyCheckbox = styled.input`
	width: 30px;
	height: 30px;
	margin-right: 8px;
	cursor: pointer;
	font-size: 17px;
	visibility: hidden;
	/* 
	&:after {
		content: ' ';
		background-color: #fff;
		display: inline-block;
		margin-left: 10px;
		padding-bottom: 5px;
		color: #00bff0;
		width: 22px;
		height: 25px;
		visibility: visible;
		border: 1px solid #00bff0;
		padding-left: 3px;
		border-radius: 5px;
	}

	&:checked:after {
		content: '\2714';
		padding: -5px;
		font-weight: bold;
	} */
`;

const Checkbox: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const { options = ['default'], name = '', value = [] } = props;
	let answers: string[] = value instanceof Array ? value : [];

	return (
		<fieldset>
			{options.map((option: string) => {
				return (
					<label key={option} htmlFor={option}>
						{option}
						<PrettyCheckbox value={answers.includes(option)} type="checkbox" id={option} />
					</label>
				);
			})}
		</fieldset>
	);
};

export default Checkbox;
