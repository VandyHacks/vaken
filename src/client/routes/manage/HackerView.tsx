import React, { FC } from 'react';
import { gql } from 'apollo-boost';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Spinner } from '../../components/Loading/Spinner';
import STRINGS from '../../assets/strings.json';
import { Title } from '../../components/Text/Title';
import LeftImgButton from '../../components/Buttons/LeftImgButton';
import back from '../../assets/img/back.svg';
import { useDetailedHackerQuery } from '../../generated/graphql';

const Layout = styled.div`
	display: grid;
	grid-template-columns: 30% 2rem auto;
	grid-template-rows: 4rem auto;
	grid-template-areas:
		'header header header'
		'profile . application';
`;

const StyledTable = styled('table')`
	border-spacing: 0.5rem;
	border-collapse: separate;
`;

const HorizontalLine = styled.hr`
	margin: 0 2rem;
	border: 0.0625rem solid ${STRINGS.ACCENT_COLOR};
	margin-bottom: 0.25rem;
`;

const Label = styled('td')`
	font-weight: 500;
	font-size: 0.875rem;
	font-family: 'Roboto', sans-serif;
	color: ${STRINGS.DARK_TEXT_COLOR};
	text-align: right;
`;

const Value = styled('td')`
	font-size: 0.875rem;
	font-family: 'Roboto', sans-serif;
	font-weight: 100;
	color: ${STRINGS.DARK_TEXT_COLOR};
`;

const Row: FC<{ label: string; value: string }> = props => {
	const { label, value } = props;

	return (
		<tr>
			<Label>{label}</Label>
			<Value>{value}</Value>
		</tr>
	);
};

export const HackerView: FC<RouteComponentProps<{}, {}, { id: string }>> = props => {
	const { location } = props;
	const { data, loading, error } = useDetailedHackerQuery({ variables: { id: location.state.id } });

	if (loading) return <Spinner />;

	// Handle missing ID separately from error
	if (!location.state.id) throw new Error('HackerView called with no hacker id provided');
	if (error) throw error;

	// If an ID was provided, no error was thrown, and it's not loading, then we have a weird problem.
	if (!data) throw new Error('No error was thrown, but no data was found either :(');

	const { hacker } = data;

	return (
		<Layout>
			<div style={{ gridArea: 'header' }}>
				<LeftImgButton
					background={STRINGS.ACCENT_COLOR}
					color="#ffffff"
					img={back}
					imgAlt="left arrow"
					width="auto"
					onClick={() => props.history.goBack()}
					paddingLeft="1.5rem"
					paddingRight="1.5rem">
					Back to table
				</LeftImgButton>
			</div>
			<div style={{ gridArea: 'profile' }}>
				<Title
					margin="0.25rem"
					fontSize="1.5rem"
					textAlign="center"
					color={STRINGS.DARKEST_TEXT_COLOR}>
					{'Profile'}
				</Title>
				<HorizontalLine />
				<StyledTable>
					<tbody>
						<Row label="First Name:" value={hacker.firstName} />
						<Row label="Last Name:" value={hacker.lastName} />
						<Row label="Email:" value={hacker.email} />
						<Row label="School:" value={hacker.school || 'Not provided'} />
						<Row label="Status:" value={hacker.status} />
					</tbody>
				</StyledTable>
			</div>
			<div style={{ gridArea: 'application' }}>
				<Title
					margin="0.25rem"
					fontSize="1.5rem"
					textAlign="center"
					color={STRINGS.DARKEST_TEXT_COLOR}>
					{'Application'}
				</Title>
				<HorizontalLine />
				<StyledTable>
					<tbody>
						{/* TODO: Travel reimbursement */}
						<Row
							label="Essay Response 1:"
							value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
						/>
						<Row
							label="Essay Response 2:"
							value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
						/>
					</tbody>
				</StyledTable>
			</div>
		</Layout>
	);
};

export default HackerView;
