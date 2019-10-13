import React, { useState } from 'react';
import { HeaderButton } from '../../components/Buttons/HeaderButton';
import { SearchBox } from '../../components/Input/SearchBox';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import { FlexRow } from '../../components/Containers/FlexContainers';
import { useCreateSponsorMutation, useCreateTierMutation, useCreateCompanyMutation } from '../../generated/graphql';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const CreateCompany:  React.FunctionComponent = (): JSX.Element => {
	const [companyName, setCompanyName] = useState('');
	const [tierId, setTierId] = useState('');
	const [createCompanyMsg, setCreateCompanyMsg] = useState('');

	const [createCompany] = useCreateCompanyMutation({
		variables: { input: { name: companyName, tierId } },
	});

	const onCreateCompany = async (): Promise<void> => {
		try {
			createCompany().catch(res => {
				setCreateCompanyMsg(`Sorry. ${res.graphQLErrors[0].message} Try again :-)`);
			})
		} catch (err) {
			console.error(err);
			setCreateCompanyMsg(`Sorry. Something bad happens.`);
		}
	};

	return (
		<React.Fragment>
			<FlexRow justifyContent="flex-start">
				<SearchBox
					width="100%"
					value={companyName}
					placeholder="Company Name"
					onChange={e => setCompanyName(e.target.value)}
					minWidth="15em"
				/>
				<SearchBox
					width="100%"
					value={tierId}
					placeholder="Tier ID"
					onChange={e => setTierId(e.target.value)}
					minWidth="15em"
				/>
				<HeaderButton width="7em" style={{ display: 'inline' }} onClick={onCreateCompany}>
					<p style={{ fontSize: '1.2rem' }}>Create</p>
				</HeaderButton>
			</FlexRow>
			<SmallCenteredText color="#3F3356" fontSize="1rem" margin="0.8em">
				<span style={{ fontWeight: 'lighter' }}>{createCompanyMsg}</span>
			</SmallCenteredText>
		</React.Fragment>
	);
};

const CreateTier:  React.FunctionComponent = (): JSX.Element => {
	const [tierName, setTierName] = useState('');
	const [permissions, setPermissions] = useState(['']);
	const [createTierMsg, setCreateTierMsg] = useState('');

	const [createTier] = useCreateTierMutation({
		variables: { input: { name: tierName, permissions: permissions } },
	});

	const onCreateTier = async (): Promise<void> => {
		try {
			createTier().catch(res => {
				setCreateTierMsg(`Sorry. ${res.graphQLErrors[0].message} Try again :-)`);
			})
		} catch (err) {
			console.error(err);
			setCreateTierMsg(`Sorry. Something bad happens.`);
		}
	};

	return (
		<React.Fragment>
			<FlexRow justifyContent="flex-start">
				<SearchBox
					width="100%"
					value={tierName}
					placeholder="Tier Name"
					onChange={e => setTierName(e.target.value)}
					minWidth="15em"
				/>
				<SearchBox
					width="100%"
					value={permissions}
					placeholder="Tier Permissions"
					onChange={e => setPermissions([e.target.value])}
					minWidth="15em"
				/>
				<HeaderButton width="7em" style={{ display: 'inline' }} onClick={onCreateTier}>
					<p style={{ fontSize: '1.2rem' }}>Create</p>
				</HeaderButton>
			</FlexRow>
			<SmallCenteredText color="#3F3356" fontSize="1rem" margin="0.8em">
				<span style={{ fontWeight: 'lighter' }}>{createTierMsg}</span>
			</SmallCenteredText>
		</React.Fragment>
	);
};

const CreateSponsor: React.FunctionComponent = (): JSX.Element => {
	const [sponsorEmail, setSponsorEmail] = useState('');
	const [sponsorName, setSponsorName] = useState('');
	const [companyId, setCompanyId] = useState('');
	const [createSponsorMsg, setCreateSponsorMsg] = useState('');

	const [createSponsor] = useCreateSponsorMutation({
		variables: { input: { companyId, email: sponsorEmail, name: sponsorName } },
	});

	const onCreateSponsorEmail = async (): Promise<void> => {
		// validate the email entered
		if (EMAIL_REGEX.test(sponsorEmail)) {
			try {
				console.log(sponsorEmail);
				console.log(sponsorName);
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
		<React.Fragment>
			<FlexRow justifyContent="flex-start">
				<SearchBox
					width="100%"
					value={sponsorEmail}
					placeholder="Sponsor's Email"
					onChange={e => setSponsorEmail(e.target.value)}
					minWidth="15em"
				/>
				<SearchBox
					width="100%"
					value={sponsorName}
					placeholder="Sponsor's Name"
					onChange={e => setSponsorName(e.target.value)}
					minWidth="15em"
				/>
				<SearchBox
					width="100%"
					value={companyId}
					placeholder="Company ID"
					onChange={e => setCompanyId(e.target.value)}
					minWidth="15em"
				/>
				<HeaderButton width="7em" style={{ display: 'inline' }} onClick={onCreateSponsorEmail}>
					<p style={{ fontSize: '1.2rem' }}>Create</p>
				</HeaderButton>
			</FlexRow>
			<SmallCenteredText color="#3F3356" fontSize="1rem" margin="0.8em">
				<span style={{ fontWeight: 'lighter' }}>{createSponsorMsg}</span>
			</SmallCenteredText>
		</React.Fragment>
	);
};

export const SponsorPage: React.FunctionComponent = (): JSX.Element => {
	return (
		<FloatingPopup
			borderRadius="1rem"
			height="auto"
			width="100%"
			backgroundOpacity="1"
			justifyContent="flex-start"
			alignItems="flex-start"
			padding="1.5rem">

			<CreateTier/>
			<CreateCompany/>
			<CreateSponsor/>
		</FloatingPopup>
	)
};

export default SponsorPage;
