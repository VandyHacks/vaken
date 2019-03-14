import React, { FunctionComponent, useState, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import config from '../../assets/application';

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
}

interface Question {
	input: any;
	fieldName: string;
}

interface Section {
	name: string;
	questions: Question[];
}

export const Application: FunctionComponent<{}> = (): JSX.Element => {
	const formRef = useRef<HTMLFormElement>(null);

	const initialState: Section[] = [];
	useEffect(() => {
		config.forEach((section: ConfigSection, i) => {
			initialState.push({
				name: section.category,
				questions: [],
			});

			section.fields.forEach((field: ConfigField) => {
				initialState[i].questions.push({
					fieldName: field.fieldName,
					input: '',
				});
			});
		});
	}, [config]);

	const [formData, setFormData] = useImmer<Section[]>(initialState);

	return (
		<form ref={formRef}>
			{config.map((section: ConfigSection) => {
				const { fields } = section;
				return (
					<React.Fragment key={section.title}>
						{fields.map(field => {
							const { title, options, ...rest } = field;
							return (
								<label key={title} htmlFor={title}>
									{title}
									<field.Component {...rest} id={title} />
								</label>
							);
						})}
					</React.Fragment>
				);
			})}
		</form>
	);
};

export default Application;

// Copyright (c) 2019 Vanderbilt University
