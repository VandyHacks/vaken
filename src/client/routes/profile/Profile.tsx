import React, { useState, useEffect } from 'react';
import { useImmer } from 'use-immer';
import TextButton from '../../components/Buttons/TextButton';
import STRINGS from '../../assets/strings.json';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import config from './ProfileConfig';
import { formChangeWrapper } from '../../components/Input/helperFunctions';
import { ConfigField, StyledQuestion, FieldNote, FieldPrompt } from '../application/Application';

const PROFILE = 'profile';

const submit = (): void => {};

export const Profile: React.FunctionComponent<{}> = (): JSX.Element => {
	const initialFormState: any = {};

	useEffect((): void => {
		initialFormState[PROFILE] = {};

		config.forEach(
			(field: ConfigField): void => {
				initialFormState[PROFILE][field.fieldName] = field.default || undefined;
			}
		);
	}, [initialFormState]);

	const [formData, setFormData] = useImmer(initialFormState);

	return (
		<FloatingPopup
			borderRadius="1rem"
			height="auto"
			width="calc(100% - 3rem)"
			backgroundOpacity="1"
			justifyContent="flex-start"
			paddingTop="0"
			alignItems="flex-start"
			padding="1.5rem">
			{config.map(
				(field: ConfigField): JSX.Element => {
					const { title, fieldName, ...rest } = field;
					const formCategory = formData[PROFILE] || {};
					// eslint-disable-next-line eqeqeq
					const fieldValue = formCategory[fieldName] == undefined ? '' : formCategory[fieldName];

					// Use either the class-based static method onChangeWrapper, or a defined
					// updateFn in the config file, and finally, a fallback for string data types.
					// eslint-disable-next-line no-nested-ternary
					const onChange = field.Component.updateFn
						? field.Component.updateFn(setFormData, PROFILE, fieldName)
						: field.updateFn
						? field.updateFn(setFormData, PROFILE, fieldName)
						: formChangeWrapper(setFormData, PROFILE, fieldName);

					return (
						<StyledQuestion key={title} htmlFor={title}>
							<div>
								{title}
								{field.note ? <FieldNote>{` – ${field.note}`}</FieldNote> : null}
							</div>
							{field.prompt ? <FieldPrompt>{field.prompt}</FieldPrompt> : null}
							<field.Component
								background="white"
								value={fieldValue}
								onChange={onChange}
								{...rest}
								id={title}
							/>
						</StyledQuestion>
					);
				}
			)}
			<TextButton
				onClick={submit}
				width="8rem"
				color="white"
				fontSize="1.4rem"
				background={STRINGS.ACCENT_COLOR}
				text="Submit"
				glowColor="rgba(0, 0, 255, 0.67)"
			/>
		</FloatingPopup>
	);
};

export default Profile;

// Copyright (c) 2019 Vanderbilt University
