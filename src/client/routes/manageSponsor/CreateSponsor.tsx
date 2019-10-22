import React, { useState } from 'react';
import styled from 'styled-components';
import { HeaderButton } from '../../components/Buttons/HeaderButton';
import { SearchBox } from '../../components/Input/SearchBox';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { SmallCenteredText } from '../../components/Text/SmallCenteredText';
import { FlexRow } from '../../components/Containers/FlexContainers';
import {
	useCreateSponsorMutation,
	useCreateTierMutation,
	useCreateCompanyMutation,
	useCompaniesQuery,
	useTiersQuery,
} from '../../generated/graphql';
import Spinner from '../../components/Loading/Spinner';

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

const StyledSelect = styled.select`
	margin: 0.25rem 1rem 0.25rem 0rem;
	padding: 0.75rem;
	box-shadow: 0rem 0.5rem 4rem rgba(0, 0, 0, 0.07);
	border-radius: 0.375rem;
	font-size: 1rem;
	box-sizing: border-box;
	border: 0.0625rem solid '#ecebed';
	min-width: 10rem;
`;

const StyledOption = styled.option`
	margin: 0.25rem 1rem 0.25rem 0rem;
	padding: 0.75rem;
	box-shadow: 0rem 0.5rem 4rem rgba(0, 0, 0, 0.07);
	border-radius: 0.375rem;
	font-size: 1rem;
	box-sizing: border-box;
	border: 0.0625rem solid '#ecebed';
	min-width: 10rem;
`;

const CreateCompany: React.FunctionComponent = (): JSX.Element => {
	const [companyName, setCompanyName] = useState('');
	const [tierId, setTierId] = useState('');
	const [createCompanyMsg, setCreateCompanyMsg] = useState('');

	const [createCompany] = useCreateCompanyMutation({
		variables: { input: { name: companyName, tierId } },
	});

	const { loading, error, data } = useTiersQuery();
	if (error) console.error(error);

	const onCreateCompany = async (): Promise<void> => {
		try {
			createCompany().catch(res => {
				setCreateCompanyMsg(`Sorry. ${res.graphQLErrors[0].message} Try again :-)`);
			});
		} catch (err) {
			console.error(err);
			setCreateCompanyMsg(`Sorry. Something bad happens.`);
		}
	};

	return (
		<>
			<FlexRow justifyContent="flex-start">
				<SearchBox
					width="100%"
					value={companyName}
					placeholder="Company Name"
					onChange={e => setCompanyName(e.target.value)}
					minWidth="15em"
				/>
				{loading || !data ? (
					<Spinner />
				) : (
					<StyledSelect onChange={e => setTierId(e.target.value)}>
						<StyledOption value="" disabled selected>
							Select Tier
						</StyledOption>
						{data.tiers.map(t => (
							<StyledOption key={t.id} value={t.id.toString()}>
								{t.name}
							</StyledOption>
						))}
					</StyledSelect>
				)}
				<HeaderButton width="7em" style={{ display: 'inline' }} onClick={onCreateCompany}>
					<p style={{ fontSize: '1.2rem' }}>Create</p>
				</HeaderButton>
			</FlexRow>
			<SmallCenteredText color="#3F3356" fontSize="1rem" margin="0.8em">
				<span style={{ fontWeight: 'lighter' }}>{createCompanyMsg}</span>
			</SmallCenteredText>
		</>
	);
};

const CreateTier: React.FunctionComponent = (): JSX.Element => {
	const [tierName, setTierName] = useState('');
	const [permissions, setPermissions] = useState(['']);
	const [createTierMsg, setCreateTierMsg] = useState('');

	const [createTier] = useCreateTierMutation({
		variables: { input: { name: tierName, permissions } },
	});

	const onCreateTier = async (): Promise<void> => {
		try {
			createTier().catch(res => {
				setCreateTierMsg(`Sorry. ${res.graphQLErrors[0].message} Try again :-)`);
			});
		} catch (err) {
			console.error(err);
			setCreateTierMsg(`Sorry. Something bad happens.`);
		}
	};

	return (
		<>
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
					placeholder="Tier Permissions (nfc, hackertable, resume)"
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
		</>
	);
};

const CreateSponsor: React.FunctionComponent = (): JSX.Element => {
	const [sponsorEmail, setSponsorEmail] = useState('');
	const [sponsorName, setSponsorName] = useState('');
	const [companyId, setCompanyId] = useState('');
	const [createSponsorMsg, setCreateSponsorMsg] = useState('');
	const { loading, error, data } = useCompaniesQuery();
	console.log(loading, error, data);

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
		<>
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
				{loading || !data ? (
					<Spinner />
				) : (
					<StyledSelect onChange={e => setCompanyId(e.target.value)}>
						<StyledOption value="" disabled selected>
							Select Company
						</StyledOption>
						{data.companies.map(c => (
							<StyledOption key={c.id} value={c.id.toString()}>
								{c.name}
							</StyledOption>
						))}
					</StyledSelect>
				)}
				<HeaderButton width="7em" style={{ display: 'inline' }} onClick={onCreateSponsorEmail}>
					<p style={{ fontSize: '1.2rem' }}>Create</p>
				</HeaderButton>
			</FlexRow>
			<SmallCenteredText color="#3F3356" fontSize="1rem" margin="0.8em">
				<span style={{ fontWeight: 'lighter' }}>{createSponsorMsg}</span>
			</SmallCenteredText>
		</>
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
			<CreateTier />
			<CreateCompany />
			<CreateSponsor />
		</FloatingPopup>
	);
};

export default SponsorPage;
