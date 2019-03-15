import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import { useImmer, Update } from 'use-immer';
import styled from 'styled-components';
import { formChangeWrapper } from '../../components/Input/helperFunctions';
import config from '../../assets/application';
import Collapsible from '../../components/Containers/Collapsible';

interface ConfigSection {
	category: string;
	fields: ConfigField[];
	title: string;
}

interface ConfigField {
	Component: any;
	fieldName: string;
	placeholder?: string;
	required?: boolean;
	title: string;
	validation?: string;
	options?: any;
	default?: any;
	other?: boolean;
	optional?: boolean;
	prompt?: string;
	note?: string;
	updateFn?: (setState: Update<any>, category: string, fieldName: string) => void;
}

interface Question {
	input: any;
	fieldName: string;
}

interface Section {
	name: string;
	questions: Question[];
}

export const StyledForm = styled.form`
	display: flex;
	flex-flow: column nowrap;

	fieldset {
		margin-top: 0.4rem;
	}
`;

export const StyledQuestion = styled.label`
	display: flex;
	flex-flow: column nowrap;
	margin-top: 1.4rem;
	font-size: 1rem;

	& > input {
		margin-top: 0.4rem;
		border-radius: 6px;
	}

	&:last-child {
		margin-bottom: 1.4rem;
	}
`;

export const FieldPrompt = styled.h3`
	font-weight: lighter;
	font-size: 1em;
`;

export const FieldNote = styled.span`
	font-style: italic;
	font-weight: lighter;
	font-size: 1em;
`;

export const FieldTitle = styled.span`
	display: inline-block;
	font-style: normal;
	font-size: 1em;
	line-height: 140%;
`;

export const Application: FunctionComponent<{}> = (): JSX.Element => {
	const formRef = useRef<HTMLFormElement>(null);

	const initialFormState: any = {};
	let initialSection = '';
	useEffect(() => {
		config.forEach((section: ConfigSection, i) => {
			initialFormState[section.category] = {};

			section.fields.forEach((field: ConfigField) => {
				initialFormState[section.category][field.fieldName] = field.default || undefined;
			});
		});
	}, [config]);

	const [formData, setFormData] = useImmer(initialFormState);
	const [curSection, setCurSection] = useState(config[0].title);

	return (
		<StyledForm ref={formRef}>
			{config.map((section: ConfigSection) => {
				const { fields, category } = section;
				return (
					<Collapsible
						onClick={Collapsible.onClick(curSection, setCurSection)}
						active={curSection}
						title={section.title}
						key={section.title}>
						{fields.map(field => {
							const { title, fieldName, ...rest } = field;
							const formCategory = formData[category] || {};
							const fieldValue =
								formCategory[fieldName] == undefined ? '' : formCategory[fieldName];

							// Use either the class-based static method onChangeWrapper, or a defined
							// updateFn in the config file, and finally, a fallback for string data types.
							const onChange = field.Component.updateFn
								? field.Component.updateFn(setFormData, category, fieldName)
								: field.updateFn
								? field.updateFn(setFormData, category, fieldName)
								: formChangeWrapper(setFormData, category, fieldName);

							return (
								<StyledQuestion key={title} htmlFor={title}>
									<div>
										{title} {field.note ? <FieldNote> – {field.note}</FieldNote> : null}
									</div>
									{field.prompt ? <FieldPrompt>{field.prompt}</FieldPrompt> : null}
									<field.Component value={fieldValue} onChange={onChange} {...rest} id={title} />
								</StyledQuestion>
							);
						})}
					</Collapsible>
				);
			})}
		</StyledForm>
	);
};

export default Application;

// Copyright (c) 2019 Vanderbilt University
