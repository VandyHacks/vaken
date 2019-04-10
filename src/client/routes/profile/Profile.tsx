import React, { useEffect, useContext } from 'react';
import { useImmer } from 'use-immer';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo-hooks';
import TextButton from '../../components/Buttons/TextButton';
import STRINGS from '../../assets/strings.json';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import config from './ProfileConfig';
import AuthContext from '../../contexts/AuthContext';
import ActionButtonContext from '../../contexts/ActionButtonContext';
import { formChangeWrapper } from '../../components/Input/helperFunctions';
import { ConfigField, StyledQuestion, FieldNote, FieldPrompt } from '../application/Application';
import { Spinner } from '../../components/Loading/Spinner';
import { HeaderButton } from '../../components/Buttons/HeaderButton';

const GET_USER_PROFILE = gql`
	query GET_USER_PROFILE($email: String!) {
		getUserByEmail(email: $email) {
			email
			firstName
			lastName
			phoneNumber
			gender
			shirtSize
			dietaryRestrictions
		}
	}
`;

const PROFILE = 'profile';

export const Profile: React.FunctionComponent<{}> = (): JSX.Element => {
	const { email } = useContext(AuthContext);
	const { update: setActionButton } = useContext(ActionButtonContext);
	const { data, loading, error } = useQuery(GET_USER_PROFILE, { variables: { email } });
	const initialFormState: any = { [PROFILE]: data.getUserByEmail };
	const [formData, setFormData] = useImmer(initialFormState);

	const submit = (): void => {};

	useEffect((): void => {
		// Update formData when graphql query changes
		console.log(data.getUserByEmail);
		if (data.getUserByEmail) {
			setFormData(draft => {
				console.log('setting form data');
				draft[PROFILE] = { ...data.getUserByEmail };
			});
		}
	}, [data]);

	useEffect((): (() => void) => {
		if (setActionButton) setActionButton(<HeaderButton text="Submit" onClick={submit} />);

		return () => {
			if (setActionButton) setActionButton(undefined);
		};
	}, []);

	return (
		<FloatingPopup
			borderRadius="1rem"
			height="auto"
			width="100%"
			backgroundOpacity="1"
			justifyContent="flex-start"
			paddingTop="0"
			alignItems="flex-start"
			padding="1.5rem">
			{loading ? (
				<Spinner />
			) : (
				config.map(
					(field: ConfigField): JSX.Element => {
						const { title, fieldName, ...rest } = field;
						const formCategory = formData[PROFILE] || {};
						const fieldValue = formCategory[fieldName] == undefined ? '' : formCategory[fieldName];

						// Use either the class-based static method onChangeWrapper, or a defined
						// updateFn in the config file, and finally, a fallback for string data types.
						const onChange = field.Component.updateFn
							? field.Component.updateFn(setFormData, PROFILE, fieldName)
							: field.updateFn
							? field.updateFn(setFormData, PROFILE, fieldName)
							: formChangeWrapper(setFormData, PROFILE, fieldName);

						return (
							<StyledQuestion key={title} htmlFor={title}>
								<div style={{ marginBottom: '0.4rem' }}>
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
				)
			)}
		</FloatingPopup>
	);
};

export default Profile;

// Copyright (c) 2019 Vanderbilt University
