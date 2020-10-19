import React, { useEffect, useState, useContext } from 'react';
import { useImmer } from 'use-immer';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import config from './ProfileConfig';
import { ActionButtonContext } from '../../contexts/ActionButtonContext';
import { StyledQuestion, StyledQuestionPadContainer } from '../application/Application';
import Spinner from '../../components/Loading/Spinner';
import { HeaderButton } from '../../components/Buttons/HeaderButton';
import { GridColumn } from '../../components/Containers/GridContainers';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import STRINGS from '../../assets/strings.json';
import { useMyProfileQuery, UserInput, useUpdateMyProfileMutation } from '../../generated/graphql';

export const Profile: React.FunctionComponent = (): JSX.Element => {
	const { update: setActionButton } = useContext(ActionButtonContext);
	const { data, loading, error } = useMyProfileQuery();
	const [loaded, setLoaded] = useState(false);
	const [input, setInput] = useImmer<UserInput>({});
	const [updateProfile] = useUpdateMyProfileMutation();

	const createOnChangeHandler = (
		fieldName: keyof UserInput
	): ((value: string) => void) => value => {
		void setInput(draft => void (draft[fieldName] = value));
	};

	useEffect((): (() => void) => {
		if (setActionButton)
			setActionButton(
				<HeaderButton width="8em" onClick={async () => updateProfile({ variables: { input } })}>
					<p>Submit</p>
				</HeaderButton>
			);

		return () => {
			if (setActionButton) setActionButton(undefined);
		};
	}, [input, setActionButton, updateProfile]);

	useEffect((): void => {
		if (!loaded && data && data.me) {
			const { __typename, id, ...loadedFields } = data.me; // eslint-disable-line @typescript-eslint/no-unused-vars
			setInput(draft => {
				Object.assign(draft, {
					...loadedFields,
				});
			});
			setLoaded(true);
		}
	}, [data, loaded, setInput]);

	// if error getting profile
	if (error) {
		console.log(error);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}
	// if successfully got profile
	return (
		<FloatingPopup
			borderRadius="1rem"
			height="auto"
			width="100%"
			backgroundOpacity="1"
			justifyContent="flex-start"
			alignItems="flex-start"
			padding="1.5rem">
			<GridColumn gap="1.4rem">
				{loading ? (
					<Spinner />
				) : (
					config.map(
						(field): JSX.Element => {
							const { Component, title, fieldName, ...rest } = field;
							const inputKey = fieldName as keyof UserInput;
							const inputVal = input[inputKey];
							return (
								<StyledQuestion key={title} htmlFor={title}>
									<StyledQuestionPadContainer>{title}</StyledQuestionPadContainer>
									<Component
										background="white"
										value={inputVal || ''}
										setState={createOnChangeHandler(inputKey)}
										{...rest}
										id={title}
									/>
								</StyledQuestion>
							);
						}
					)
				)}
			</GridColumn>
		</FloatingPopup>
	);
};

export default Profile;
