import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import * as EmailValidator from 'email-validator';
import { toast } from 'react-toastify';
import { Button } from '../../components/Buttons/Button';
import { SearchBox } from '../../components/Input/SearchBox';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { FlexRow } from '../../components/Containers/FlexContainers';
import {
	useCreateSponsorMutation,
	useCreateTierMutation,
	useCreateCompanyMutation,
	useCompaniesQuery,
	useTiersQuery,
	CompaniesDocument,
	TiersDocument,
} from '../../generated/graphql';
import { Spinner } from '../../components/Loading/Spinner';

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

const showToast = (message: string, isError = false): void => {
	toast.dismiss();
	(isError ? toast.error : toast.success)(
		<p>
			<em className="toast-emphasize">{message}</em>
		</p>,
		{
			position: 'bottom-right',
		}
	);
};

const CreateTier: React.FC = () => {
	const [tierName, setTierName] = useState('');
	const [permissions, setPermissions] = useState(['']);

	const [createTier] = useCreateTierMutation({
		variables: { input: { name: tierName, permissions } },
		refetchQueries: [{ query: TiersDocument }],
		awaitRefetchQueries: true,
	});

	const onCreateTier = async (): Promise<void> => {
		try {
			createTier()
				.then(() => showToast(`Tier ${tierName} created successfully!`))
				.catch(res => showToast(`Sorry. ${res.graphQLErrors[0].message} Please try again :)`, true))
				.finally(() => {
					setTierName('');
					setPermissions(['']);
				});
		} catch (err) {
			console.error(err);
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
					onChange={e => setPermissions(e.target.value.split(','))}
					minWidth="15em"
				/>
				<Button onClick={onCreateTier}>Create Tier</Button>
			</FlexRow>
		</>
	);
};

const CreateCompany: React.FunctionComponent = (): JSX.Element => {
	const [companyName, setCompanyName] = useState('');
	const [tierId, setTierId] = useState('');
	const selectTierRef = useRef<HTMLSelectElement>(null);

	const [createCompany] = useCreateCompanyMutation({
		variables: { input: { name: companyName, tierId } },
		refetchQueries: [{ query: CompaniesDocument }],
		awaitRefetchQueries: true,
	});

	const { loading, error, data } = useTiersQuery();
	if (error) console.error(error);

	const onCreateCompany = async (): Promise<void> => {
		try {
			createCompany()
				.then(() => showToast(`Company ${companyName} created successfully!`))
				.catch(res => showToast(`Sorry. ${res.graphQLErrors[0].message} Please try again :)`, true))
				.finally(() => {
					setCompanyName('');
					if (selectTierRef && selectTierRef.current) {
						selectTierRef.current.value = '';
					}
				});
		} catch (err) {
			console.error(err);
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
					<StyledSelect onChange={e => setTierId(e.target.value)} ref={selectTierRef}>
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
				<Button onClick={onCreateCompany}>Create Company</Button>
			</FlexRow>
		</>
	);
};

const CreateSponsor: React.FunctionComponent = (): JSX.Element => {
	const [sponsorEmail, setSponsorEmail] = useState('');
	const [sponsorName, setSponsorName] = useState('');
	const [companyId, setCompanyId] = useState('');
	const { loading, data } = useCompaniesQuery();
	const selectCompanyRef = useRef<HTMLSelectElement>(null);

	const [createSponsor] = useCreateSponsorMutation({
		variables: { input: { companyId, email: sponsorEmail, name: sponsorName } },
	});

	const onCreateSponsorEmail = async (): Promise<void> => {
		if (EmailValidator.validate(sponsorEmail)) {
			try {
				createSponsor()
					.then(() =>
						showToast(`Email ${sponsorEmail} for sponsor ${sponsorName} created successfully!`)
					)
					.catch(res =>
						showToast(`Sorry. ${res.graphQLErrors[0].message} Please try again :)`, true)
					)
					.finally(() => {
						setSponsorEmail('');
						setSponsorName('');
						if (selectCompanyRef && selectCompanyRef.current) {
							selectCompanyRef.current.value = '';
						}
					});
			} catch (err) {
				console.error(err);
			}
		} else {
			showToast(`Email ${sponsorEmail} is not valid for creating a sponsor`, true);
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
					<StyledSelect onChange={e => setCompanyId(e.target.value)} ref={selectCompanyRef}>
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
				<Button onClick={onCreateSponsorEmail}>Create Sponsor Email</Button>
			</FlexRow>
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
