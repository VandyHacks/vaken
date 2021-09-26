import React, {
	useContext,
	FunctionComponent,
	useState,
	useEffect,
	useCallback,
	FC,
	useReducer,
} from 'react';
import styled from 'styled-components';
import { useImmer } from 'use-immer';
import { toast } from 'react-toastify';
import { Spinner } from '../../components/Loading/Spinner';
import config from '../../assets/application';
import { Collapsible } from '../../components/Containers/Collapsible';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { ActionButtonContext } from '../../contexts/ActionButtonContext';
import { Button } from '../../components/Buttons/Button';
import { InputProps } from '../../components/Input/TextInput';
import {
	useUpdateMyApplicationMutation,
	useMyApplicationQuery,
	ApplicationInput,
	ApplicationStatus,
} from '../../generated/graphql';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import { VandyStudentContext } from './VandyStudentContext';

export interface ConfigSection {
	category: string;
	fields: ConfigField[];
	title: string;
}

export interface ConfigField {
	Component: FC<InputProps>;
	default?: string;
	fieldName: string;
	note?: string;
	optional?: boolean;
	// Presence of nonVandyDefault implies question should only be shown for Vandy applicants
	nonVandyDefault?: string;
	options?: Promise<{ data: string[] }> | string[];
	other?: boolean;
	placeholder?: string;
	prompt?: string;
	required?: boolean;
	title?: string;
	validation?: string;
}

export const StyledForm = styled.form`
	display: flex;
	max-width: 100%;
	flex-direction: column;
	max-width: 100%;

	fieldset {
		margin-top: 0.4rem;
	}

	& > div:not(:first-of-type) {
		margin-top: 1.4rem;
	}
`;

export const StyledQuestion = styled.label`
	display: flex;
	flex-flow: column nowrap;
	font-size: 1rem;

	& > input {
		border-radius: 4px;
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

const disableEnter = (e: React.KeyboardEvent<HTMLFormElement>): void => {
	if (e.key === 'Enter') e.preventDefault();
};

let autosaveTimeout: NodeJS.Timeout;

/**
 * Finds the first element that is required (not optional) but does not have any input.
 * It should only be run on form submit because it is quite heavy.
 * @param input List of application inputs
 */
const findRequiredUnfilled = (input: ApplicationInput[]): JSX.Element => {
	const requiredQuestion = config
		.flatMap(section => section.fields as ConfigField[])
		.find(
			field =>
				!field.optional && !input.find(el => el.question === field.fieldName && el.answer.trim())
		);
	return requiredQuestion ? (
		<p>
			<em className="toast-emphasize">{requiredQuestion.title}</em>
			&nbsp;is required
		</p>
	) : (
		<></>
	);
};

export const Application: FunctionComponent = (): JSX.Element => {
	const { update: setActionButton } = useContext(ActionButtonContext);
	const [openSection, setOpenSection] = useState('');
	const [input, setInput] = useImmer<{ answer: string; question: string }[]>([]);
	const [loaded, setLoaded] = useState(false);
	const [updateApplication] = useUpdateMyApplicationMutation();
	const { data, error, loading } = useMyApplicationQuery();

	const vandyStudentReducer = (state: number, action: boolean): number => {
		// state = 1: just flipped it on
		// state = 2: already flipped on. Idempotency case.
		// state = 0: flipped off.
		if (action) {
			return state === 0 ? 1 : 2;
		}
		return 0;
	};
	const [vandyStatus, setVandyStatus] = useReducer(vandyStudentReducer, 0);

	// Only update changed QuestionIDs
	const createOnChangeHandler = (fieldName: string): ((value: string) => void) => value => {
		void setInput(draft => {
			const element = draft.find(el => el.question === fieldName);
			if (!element) {
				draft.push({ answer: value, question: fieldName });
			} else {
				element.answer = value;
			}
		});
	};

	const valueHandler = useCallback(
		(fieldName: string): string => {
			const element = input.find(el => el.question === fieldName);
			return element ? element.answer : '';
		},
		[input]
	);

	useEffect(() => {
		setVandyStatus(valueHandler('school') === 'Vanderbilt University');
	}, [valueHandler]);

	useEffect((): (() => void) => {
		if (setActionButton)
			setActionButton(
				<Button
					async
					large
					onClick={async () => {
						const firstRequiredUnfilledToast = findRequiredUnfilled(input);
						toast.dismiss();
						if (firstRequiredUnfilledToast !== <></>)
							toast.error(firstRequiredUnfilledToast, {
								position: 'bottom-right',
							});
						else
							return updateApplication({
								variables: { input: { fields: input, submit: true } },
							}).then(() => {
								toast.dismiss();
								return toast.success('Application submitted successfully!', {
									position: 'bottom-right',
								});
							});
						return Promise.resolve();
					}}>
					Submit
				</Button>
			);

		return () => {
			if (setActionButton) setActionButton(undefined);
		};
	}, [input, setActionButton, updateApplication]);

	useEffect((): void => {
		if (!loaded && data && data.me && data.me.__typename === 'Hacker') {
			const { application } = data.me;
			setInput(draft => {
				draft.length = 0; // Clear the array

				// Omit the `__typename` field.
				application.forEach(({ question, answer }) =>
					draft.push({ answer: answer || '', question })
				);
			});
			setOpenSection(config[0].title);
			setLoaded(true);
		}
	}, [data, loaded, setLoaded, setInput]);

	useEffect(() => {
		// Auto-save application input after five seconds of inactivity.
		autosaveTimeout = setTimeout(
			() =>
				input.length &&
				// Do not auto-save after a hacker has been accepted to workaround:
				// TODO: Prevent hackers from removing fields and letting auto-save wipe
				// them from the DB, then remove this workaround.
				!(
					data &&
					data.me &&
					data.me.__typename === 'Hacker' &&
					[
						ApplicationStatus.Accepted,
						ApplicationStatus.Confirmed,
						ApplicationStatus.Rejected,
					].includes(data.me.status)
				) &&
				updateApplication({ variables: { input: { fields: input, submit: false } } }),
			5000
		);

		// Cleanup
		return () => clearTimeout(autosaveTimeout);
	}, [data, input, updateApplication]);

	const toggleOpen = useCallback(
		(e: React.MouseEvent<HTMLButtonElement>): void => {
			const { id } = e.currentTarget;
			setOpenSection(openSection === id ? '' : id);
			e.preventDefault();
		},
		[openSection]
	);

	// if error getting application input
	if (error) {
		console.log(error);
		return <GraphQLErrorMessage text={JSON.stringify(error)} />;
	}

	if (loading) return <Spinner />;

	return (
		<FloatingPopup
			// height="100%"
			width="100%"
			backgroundOpacity="1"
			justifyContent="flex-start"
			alignItems="flex-start"
			padding="1.5rem">
			<StyledForm onKeyPress={disableEnter}>
				<VandyStudentContext.Provider value={{ vandyStatus, setVandyStatus }}>
					{config.map(({ fields, title = '' }: ConfigSection) => (
						<Collapsible
							onClick={toggleOpen}
							open={openSection === title}
							title={title}
							key={title}>
							{fields.map(field => {
								const hideForNonVandy = field.nonVandyDefault && vandyStatus === 0;
								return (
									<StyledQuestion key={field.fieldName} htmlFor={field.fieldName}>
										{field.title && !hideForNonVandy ? (
											<StyledQuestionPadContainer>
												{field.title}
												{!field.optional ? `*` : null}
												{field.note ? <FieldNote>{` - ${field.note}`}</FieldNote> : null}
											</StyledQuestionPadContainer>
										) : null}
										{field.prompt && !hideForNonVandy ? (
											<FieldPrompt>{field.prompt}</FieldPrompt>
										) : null}
										<field.Component
											setState={createOnChangeHandler(field.fieldName)}
											value={valueHandler(field.fieldName)}
											{...field}
											id={field.fieldName}
										/>
									</StyledQuestion>
								);
							})}
						</Collapsible>
					))}
				</VandyStudentContext.Provider>
			</StyledForm>
		</FloatingPopup>
	);
};

export default Application;
