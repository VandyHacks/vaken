import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import AutoComplete from '../../components/Input/AutoCompleteTextInput';
import { onChangeWrapper, formChangeWrapper } from '../../components/Input/helperFunctions';
import TextInput from '../../components/Input/TextInput';
import { AppField, AppSection } from './ApplicationConfig'; // TODO Delete this
import Checkbox from '../../components/Input/Checkbox';
import config from '../../assets/application.json';
import institutions from '../../assets/data/institutions.json';

interface Props {
	input: string;
	options?: string[];
	id: string; //Req'd for form label
	placeholder?: string;
	pattern?: string;
	completions?: string[];
	name: string;
}

export type fieldValue = string | string[] | undefined;
export type field = {
	name: string;
	value: fieldValue;
};

const InputFactory: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const [value, setValue] = useImmer(new Map<string, fieldValue>());
	const { input, ...rest } = props;
	const { name } = props;

	switch (input) {
		case 'input':
			return (
				<TextInput {...rest} value={value.get(name)} onChange={formChangeWrapper(setValue, name)} />
			);
		case 'slider':
			return (
				<TextInput
					{...rest}
					value={value.get(name)}
					onChange={formChangeWrapper(setValue, name)}
				/> /* TODO: Create Slider */
			);
		case 'multi-checkbox':
			return (
				<div />
				// <Checkbox
				// 	{...rest}
				// 	onChange={formChangeWrapper(setValue, name)}
				// 	value={value.get(name)}
				// /> /* TODO: Create checkbox */
			);
		// case 'toggle':
		// 	return (
		// 		<RadioButton
		// 			{...rest}
		// 			onChange={formChangeWrapper(setValue, name)}
		// 			value={value.get(name)}
		// 		/> /* TODO: Create checkbox */
		// 	);
		case 'autocomplete/school':
			return (
				<AutoComplete
					{...rest}
					options={institutions}
					value={value.get(name)}
					onChange={formChangeWrapper(setValue, name)}
				/>
			);
	}

	return (
		<p>
			<b>No component found :(</b>
		</p>
	);
};

export const Prompt = styled.h2``;

export const Application: FunctionComponent<{}> = (props): JSX.Element => {
	const formRef = useRef<HTMLFormElement>(null);
	const [formData, setFormData] = useState(new Map<string, fieldValue>());

	return (
		<form ref={formRef}>
			{config.map((section: AppSection) => {
				return (
					<fieldset key={section.title}>
						<legend>{section.title}</legend>
						{section.fields.map(
							(field: AppField): JSX.Element => {
								const { title, validation = '', note, ...rest } = field;
								return (
									<label key={title} htmlFor={title}>
										{title}
										{prompt ? <Prompt>{prompt}</Prompt> : null}
										<InputFactory id={title} pattern={validation} {...rest} />
									</label>
								);
							}
						)}
					</fieldset>
				);
			})}

			{/* <label htmlFor="school">
				School
				<AutoComplete
					id="school"
					required
					value={school}
					onChange={onChangeWrapper(setSchool)}
					completions={institutions}
				/>
			</label>
			<label htmlFor="email">
				email
				<TextInput id="email" value={email} type="email" onChange={onChangeWrapper(setEmail)} />
			</label>
			<label htmlFor="name">
				Name
				<TextInput id="name" value={name} onChange={onChangeWrapper(setName)} />
			</label> */}
		</form>
	);
};

// export default Application;
export default Application;
