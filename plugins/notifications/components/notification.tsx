import React, { FunctionComponent, useState, useEffect } from 'react';
import styled from 'styled-components';
import { GraphQLError } from 'graphql';
import {
	_Plugin__Platform,
	use_Plugin__CreateNotificationMutation,
	_Plugin__CreateNotificationMutationHookResult,
	UserType,
} from '../../../src/client/generated/graphql';
import { SearchBox } from '../../../src/client/components/Input/SearchBox';
import TextArea from '../../../src/client/components/Input/TextArea';
import { Checkbox } from '../../../src/client/components/Input/Checkbox';
import { HeaderButton } from '../../../src/client/components/Buttons/HeaderButton';
import SmallCenteredText from '../../../src/client/components/Text/SmallCenteredText';
import FloatingPopup from '../../../src/client/components/Containers/FloatingPopup';

import {
	StyledQuestion,
	StyledForm,
	FieldNote,
	StyledQuestionPadContainer,
} from '../../../src/client/routes/application/Application';
import STRINGS from '../../../src/client/assets/strings.json';
import Notification from '../../../src/client/assets/img/notification.svg';

const disableEnter = (e: React.KeyboardEvent<HTMLFormElement>): void => {
	if (e.key === 'Enter') e.preventDefault();
};

const StyledFormClone = styled(StyledForm)`
	width: 50%;
`;

const StyledQuestionClone = styled(StyledQuestion)`
	margin: 0.7rem;
`;

const Msg = styled.p`
	font-size: 1rem;
	color: #ffffff;
	white-space: pre-line;
	grid-area: text;
	padding-left: 1.5rem;
`;

export const notification: FunctionComponent = (): JSX.Element => {
	const [message, setMessage] = useState('');
	const [userTypes, setUserTypes] = useState([UserType.Hacker]);
	const [platforms, setPlatforms] = useState([_Plugin__Platform.Email]);
	const [subject, setSubject] = useState('');
	const [discordRole, setDiscordRole] = useState('');
	const [warning, setWarning] = useState('');
	const [sentNotification, setSentNotification] = useState(false);

	useEffect(() => {
		setPlatforms([]);
		setUserTypes([]);
	}, []);

	const [createNotification] = use_Plugin__CreateNotificationMutation({
		variables: {
			input: {
				message,
				platforms,
				discordRole,
				subject,
				userTypes,
			},
		},
	});

	const onCreateNotification = async (): Promise<void> => {
		if (platforms.length === 0) {
			setWarning('Specify a platform');
			setSentNotification(false);
		} else if (message === '') {
			setWarning('Specify a message');
			setSentNotification(false);
		} else if (platforms.includes(_Plugin__Platform.Email) && userTypes.length === 0) {
			setWarning('Specify user types to send the email to');
			setSentNotification(false);
		} else if (platforms.includes(_Plugin__Platform.Email) && subject === '') {
			setWarning('Specify an email subject');
			setSentNotification(false);
		} else if (platforms.includes(_Plugin__Platform.Discord) && discordRole === '') {
			setWarning('Specify a Discord role');
			setSentNotification(false);
		} else {
			setWarning('');
			setMessage('');
			setUserTypes([]);
			setPlatforms([]);
			setSubject('');
			setDiscordRole('');
			try {
				createNotification()
					.then(() => setSentNotification(true))
					.catch((err: GraphQLError[]) => setWarning(err[0].message));
			} catch (err) {
				setWarning(err);
			}
		}
	};

	const setPlatformWrapper = (s: string): void => {
		const arr: _Plugin__Platform[] = [];
		s.split('|').forEach(platform => {
			switch (platform) {
				case 'DISCORD':
					arr.push(_Plugin__Platform.Discord);
					break;
				case 'EMAIL':
					arr.push(_Plugin__Platform.Email);
					break;
				default:
			}
		});
		setPlatforms(arr);
	};

	const setUserTypesWrapper = (s: string): void => {
		const arr: UserType[] = [];
		s.split('|').forEach(platform => {
			switch (platform) {
				case 'HACKER':
					arr.push(UserType.Hacker);
					break;
				case 'MENTOR':
					arr.push(UserType.Mentor);
					break;
				case 'ORGANIZER':
					arr.push(UserType.Organizer);
					break;
				case 'VOLUNTEER':
					arr.push(UserType.Volunteer);
					break;
				case 'SPONSOR':
					arr.push(UserType.Sponsor);
					break;
				default:
			}
		});
		setUserTypes(arr);
	};

	return (
  <>
  <FloatingPopup
				borderRadius="1rem"
  height="auto"
				width="100%"
  backgroundOpacity="1"
				justifyContent="flex-start"
  alignItems="flex-start"
				padding="1.5rem"
			>
				<StyledFormClone onSubmit={event => event.preventDefault()} onKeyPress={disableEnter}>
					<StyledQuestionClone key="platform" htmlFor="platform">
						<StyledQuestionPadContainer>Platform</StyledQuestionPadContainer>
    <Checkbox
							value={platforms.join('|')}
							options={[_Plugin__Platform.Discord, _Plugin__Platform.Email]}
							setState={setPlatformWrapper}
						/>
  </StyledQuestionClone>
					<StyledQuestionClone key="message" htmlFor="message">
						<StyledQuestionPadContainer>Message</StyledQuestionPadContainer>
    <TextArea value={message} setState={setMessage} />
  </StyledQuestionClone>

					{platforms.includes(_Plugin__Platform.Email) && (
  <>
							<StyledQuestionClone key="subject" htmlFor="subject">
								<StyledQuestionPadContainer>Email Subject</StyledQuestionPadContainer>
      <SearchBox
									width="100%"
									value={subject}
									placeholder="Subject"
									onChange={e => setSubject(e.target.value)}
									minWidth="15em"
								/>
    </StyledQuestionClone>

							<StyledQuestionClone key="userType" htmlFor="userType">
								<StyledQuestionPadContainer>
									User Type
									<FieldNote>- for email</FieldNote>
  </StyledQuestionPadContainer>
								<Checkbox
									value={userTypes.join('|')}
									options={[
										UserType.Hacker,
										UserType.Organizer,
										UserType.Mentor,
										UserType.Sponsor,
										UserType.Volunteer,
									]}
									setState={setUserTypesWrapper}
  />
    </StyledQuestionClone>
						</>
					)}

					{platforms.includes(_Plugin__Platform.Discord) && (
  <StyledQuestionClone key="discordRole" htmlFor="discordRole">
  <StyledQuestionPadContainer>
								Discord Roles (comma separated list)
  <FieldNote>- must be EXACTLY what it is in Discord</FieldNote>
							</StyledQuestionPadContainer>
							<SearchBox
								width="100%"
								value={discordRole}
								placeholder="Discord Role"
								onChange={e => setDiscordRole(e.target.value)}
								minWidth="15em"
    />
						</StyledQuestionClone>
					)}

					<HeaderButton width="7em" style={{ display: 'inline' }} onClick={onCreateNotification}>
    <p style={{ fontSize: '1.2rem' }}>Create</p>
  </HeaderButton>
					{/* <SmallCenteredText color="#f95446 " fontSize="1rem" margin="0.8em"> */}
      {/*				<span style={{ fontWeight: 'lighter' }}>{warning}</span> */}
					{/*			</SmallCenteredText> */}
    </StyledFormClone>
			</FloatingPopup>
			{warning !== '' && (
    <FloatingPopup
  borderRadius="1rem"
  width="20rem"
  backgroundOpacity="1"
  backgroundColor={STRINGS.WARNING_COLOR}
  marginBottom="1rem"
  marginTop="2rem"
					padding="1.5rem"
				>
  <Msg>{warning}</Msg>
				</FloatingPopup>
			)}

  {sentNotification && (
				<FloatingPopup
    borderRadius="1rem"
    width="20rem"
					backgroundOpacity="1"
    backgroundColor={STRINGS.ACCENT_COLOR}
					marginBottom="1rem"
    marginTop="2rem"
					padding="1.5rem"
  >
    <Msg>Sent Notification</Msg>
  </FloatingPopup>)}
		</>
	);
};

export default notification;
