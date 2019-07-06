import React, {
	useContext,
	FunctionComponent,
	useState,
	useEffect,
	useRef,
	useCallback,
} from 'react';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import config from '../../assets/application';
import { Collapsible } from '../../components/Containers/Collapsible';
import { ActionButtonContext } from '../../contexts/ActionButtonContext';
import { HeaderButton } from '../../components/Buttons/HeaderButton';
import { ApplicationField, ApplicationQuestion } from '../../generated/graphql';

export interface ConfigSection {
	category: string;
	fields: ConfigField[];
	title: string;
}

export interface ConfigField {
	Component: any;
	default?: any;
	fieldName: string;
	note?: string;
	optional?: boolean;
	options?: any;
	other?: boolean;
	placeholder?: string;
	prompt?: string;
	required?: boolean;
	title: string;
	validation?: string;
}

interface Question {
	fieldName: string;
	input: any;
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

export const Application: FunctionComponent<{}> = (): JSX.Element => {
	const { update: setActionButton } = useContext(ActionButtonContext);
	const [openSection, setOpenSection] = useState('');
	const formRef = useRef<HTMLFormElement>(null);

	useEffect((): (() => void) => {
		if (setActionButton)
			setActionButton(
				<HeaderButton onClick={() => {}} width="8em">
					Submit
				</HeaderButton>
			);

		return () => {
			if (setActionButton) setActionButton(undefined);
		};
	}, [setActionButton]);

	const toggleOpen = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>): void => {
			const { id } = e.currentTarget;
			setOpenSection(openSection === id ? '' : id);
			e.preventDefault();
		},
		[openSection]
	);

	return (
		<StyledForm ref={formRef}>
			{config.map(({ fields, title }: ConfigSection) => (
				<Collapsible onClick={toggleOpen} open={openSection === title} title={title} key={title}>
					{fields.map(field => (
						<StyledQuestion key={field.title} htmlFor={field.title}>
							<StyledQuestionPadContainer>
								{field.title}
								{field.note ? <FieldNote>{` - ${field.note}`}</FieldNote> : null}
							</StyledQuestionPadContainer>
							{field.prompt ? <FieldPrompt>{field.prompt}</FieldPrompt> : null}
							<field.Component value="" {...field} id={field.title} />
						</StyledQuestion>
					))}
				</Collapsible>
			))}
		</StyledForm>
	);
};

export default Application;
