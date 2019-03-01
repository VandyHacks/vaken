import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useImmer, Update } from 'use-immer';
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
	setState: Update<Map<string, fieldValue>>;
	state: Map<string, fieldValue>;
}

export type fieldValue = string | Set<string>;
export type field = {
	name: string;
	value: fieldValue;
};

const InputFactory: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const { setState, state, input, ...rest } = props;
	const { name } = props;

	const strVal = typeof state.get(name) === 'string' ? (state.get(name) as string) : '';

	switch (input) {
		case 'input':
			if (!state.has(name)) {
				setState(state => state.set(name, ''));
			}
			return <TextInput {...rest} value={strVal} onChange={formChangeWrapper(setState, name)} />;
		case 'slider':
			return (
				<TextInput
					{...rest}
					value={strVal}
					onChange={formChangeWrapper(setState, name)}
				/> /* TODO: Create Slider */
			);
		case 'multi-checkbox':
			return (
				<div />
				// <Checkbox
				// 	{...rest}
				// 	onChange={formChangeWrapper(setstate, name)}
				// 	state={value.get(name)}
				// /> /* TODO: Create checkbox */
			);
		// case 'toggle':
		// 	return (
		// 		<RadioButton
		// 			{...rest}
		// 			onChange={formChangeWrapper(setstate, name)}
		// 			state={value.get(name)}
		// 		/> /* TODO: Create checkbox */
		// 	);
		case 'autocomplete/school':
			return (
				<AutoComplete
					{...rest}
					options={institutions}
					value={strVal}
					onChange={formChangeWrapper(setState, name)}
				/>
			);
	}

	return (
		<p>
			<b>No component found :(</b>
		</p>
	);
};

export const Prompt = styled.h2`
	font-style: bold;
`;

export const Application: FunctionComponent<{}> = (props): JSX.Element => {
	const formRef = useRef<HTMLFormElement>(null);
	const [formData, setFormData] = useImmer(new Map<string, fieldValue>());
	console.log('yeeting', formData);

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
										<InputFactory
											setState={setFormData}
											state={formData}
											id={title}
											pattern={validation}
											{...rest}
										/>
									</label>
								);
							}
						)}
					</fieldset>
				);
			})}
		</form>
	);
};

// export default Application;
export default Application;
