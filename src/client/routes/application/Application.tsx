import React, { useContext, FunctionComponent, useState, useEffect, useRef } from 'react';
import { useImmer, Update } from 'use-immer';
import styled from 'styled-components';
import { formChangeWrapper } from '../../components/Input/helperFunctions';
import config from '../../assets/application';
import Collapsible from '../../components/Containers/Collapsible';
import ActionButtonContext from '../../contexts/ActionButtonContext';
import { HeaderButton } from '../../components/Buttons/HeaderButton';

export interface ConfigSection {
	category: string;
	fields: ConfigField[];
	title: string;
}

export interface ConfigField {
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
	font-size: 1rem;

	& > input {
		border-radius: 6px;
		background: white;
	}
`;

export const StyledQuestionPadContainer = styled.div`
	margin-bottom: 0.4rem;
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

const submit = () => {};

export const Application: FunctionComponent<{}> = (): JSX.Element => {
	const { update: setActionButton } = useContext(ActionButtonContext);
	const formRef = useRef<HTMLFormElement>(null);

	const initialFormState: any = {};
	useEffect(() => {
		config.forEach(
			(section: ConfigSection): void => {
				initialFormState[section.category] = {};

				section.fields.forEach((field: ConfigField) => {
					initialFormState[section.category][field.fieldName] = field.default || undefined;
				});
			}
		);
	}, [initialFormState]);

	useEffect((): (() => void) => {
		if (setActionButton) setActionButton(<HeaderButton text="Submit" onClick={submit} />);

		return () => {
			if (setActionButton) setActionButton(undefined);
		};
	}, []);

	const [formData, setFormData] = useImmer(initialFormState);

	const [openSection, setOpenSection] = useState(
		initialFormState instanceof Array ? initialFormState[0].title : ''
	);

	const toggleOpen = (e: React.MouseEvent<HTMLButtonElement>): void => {
		const { id } = e.target as HTMLButtonElement;

		if (openSection === id) {
			setOpenSection('');
		} else {
			setOpenSection(id);
		}

		e.preventDefault();
	};

	/* eslint-disable eqeqeq */

	return (
		<StyledForm ref={formRef}>
			{config.map((section: ConfigSection, i: number) => {
				const { fields, category } = section;
				console.log('opensection', openSection);
				return (
					<Collapsible
						onClick={toggleOpen}
						open={openSection === section.title}
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
									<StyledQuestionPadContainer>
										{title}
										{field.note ? <FieldNote>{` - ${field.note}`}</FieldNote> : null}
									</StyledQuestionPadContainer>
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
