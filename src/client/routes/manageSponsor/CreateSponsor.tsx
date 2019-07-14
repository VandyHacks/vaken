import React, { useState } from 'react';
import { HeaderButton } from '../../components/Buttons/HeaderButton';
import { SearchBox } from '../../components/Input/SearchBox';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import { FlexRow } from '../../components/Containers/FlexContainers';
import { useCreateSponsorMutation } from '../../generated/graphql';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const CreateSponsor: React.FunctionComponent = (): JSX.Element => {
	const [sponsorEmail, setSponsorEmail] = useState('');
	const [sponsorName, setSponsorName] = useState('');
	const [createSponsorMsg, setCreateSponsorMsg] = useState('');
	const createSponsor = useCreateSponsorMutation({
		variables: { input: { email: sponsorEmail, name: sponsorName } },
	});

	const onCreateSponsorEmail = async (): Promise<void> => {
		// validate the email entered
		if (EMAIL_REGEX.test(sponsorEmail)) {
			try {
				// console.log(sponsorEmail)
				// console.log(sponsorName)
				createSponsor().catch(res => {
					setCreateSponsorMsg(`Sorry. ${res.graphQLErrors[0].message} Try again :-)`);
				});
				// create sponsor in the database
				// already created or not
			} catch (err) {
				console.error(err);
				setCreateSponsorMsg(`Sorry. Something bad happens.`);
			}
		} else {
			setCreateSponsorMsg(`Email '${sponsorEmail}' is not valid when creating sponsor`);
		}
	};

	return (
		<FloatingPopup
			borderRadius="1rem"
			height="auto"
			width="100%"
			backgroundOpacity="1"
			justifyContent="flex-start"
			alignItems="flex-start"
			padding="1.5rem">
			<FlexRow justifyContent="flex-start">
				<SearchBox
					// fontSize="1.2rem"
					width="100%"
					// flex-flow="row nowrap"
					value={sponsorEmail}
					placeholder="Sponsor's Email"
					onChange={e => setSponsorEmail(e.target.value)}
					minWidth="15em"
				/>
				<SearchBox
					// fontSize="1.2rem"
					width="100%"
					// flex-flow="row nowrap"
					value={sponsorName}
					placeholder="Sponsor's Name"
					onChange={e => setSponsorName(e.target.value)}
					minWidth="15em"
				/>
				<HeaderButton width="7em" style={{ display: 'inline' }} onClick={onCreateSponsorEmail}>
					<p style={{ fontSize: '1.2rem' }}>Create</p>
				</HeaderButton>
			</FlexRow>
			<SmallCenteredText color="#3F3356" fontSize="1rem" margin="0.8em">
				<span style={{ fontWeight: 'lighter' }}>{createSponsorMsg}</span>
			</SmallCenteredText>
		</FloatingPopup>
	);
};

export default CreateSponsor;
