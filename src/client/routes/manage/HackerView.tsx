import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import escape from 'escape-html';
import { title } from 'case';
import { Spinner } from '../../components/Loading/Spinner';
import STRINGS from '../../assets/strings.json';
import { Title } from '../../components/Text/Title';
import { Button } from '../../components/Buttons/Button';
import back from '../../assets/img/back.svg';
import { useDetailedHackerQuery, useSignedReadUrlQuery } from '../../generated/graphql';
import appConfig from '../../assets/application';
import { ConfigField } from '../application/Application';

const Layout = styled.div`
	display: flex;
	flex-flow: column nowrap;
	width: 100%;
	max-height: 100%;
	overflow-y: auto;
	user-select: text;
`;

const StyledTable = styled('table')`
	border-spacing: 0.5rem;
	border-collapse: separate;
	overflow: auto;
	height: 100%;
`;

const HorizontalLine = styled.hr`
	margin: 0 2rem;
	border: 0.0625rem solid ${STRINGS.ACCENT_COLOR_DARK};
	margin-bottom: 0.25rem;
`;

const Label = styled('td')`
	font-weight: 500;
	font-size: 1.1em;
	font-family: 'Roboto', sans-serif;
	color: ${STRINGS.DARK_TEXT_COLOR};
	text-align: right;
	white-space: wrap;
	flex: 1 1 0px;
`;

const Value = styled('td')`
	font-size: 1.1em;
	font-family: 'Roboto', sans-serif;
	font-weight: 100;
	color: ${STRINGS.DARK_TEXT_COLOR};
	flex: 3 1 0px;

	@media screen and (min-width: 457px) {
		margin-left: 10px;
	}
`;

const TableRow = styled.tr`
	display: flex;
	padding: 10px 0;

	&:nth-of-type(2n) {
		background: rgba(0, 0, 0, 0.05);
	}

	@media screen and (max-width: 456px) {
		flex-flow: column nowrap;
		padding: 10px;

		${Label} {
			text-align: left;
			padding-bottom: 5px;
		}
	}
`;

const DangerousRow: FC<{ label: string; value: string }> = props => {
	const { label, value } = props;

	return (
		<TableRow>
			<Label>{label}</Label>
			<Value dangerouslySetInnerHTML={{ __html: value }} />
		</TableRow>
	);
};

const Row: FC<{ label: string; value: string }> = props => {
	const { label, value } = props;
	// TODO: Make '|' a constant.
	const text = value.includes('|')
		? `${value.split('|').map(val => `<span key="${escape(val)}">${title(escape(val))}</span>`)}`
		: `<span>${escape(value)}</span>`;

	return <DangerousRow label={label} value={text} />;
};

export type HackerViewProps = RouteComponentProps<{ id: string }>;

export const HackerView: FC<HackerViewProps> = props => {
	const { match } = props;
	const { data, loading, error } = useDetailedHackerQuery({ variables: { id: match.params.id } });
	const fileReadUrlQuery = useSignedReadUrlQuery({
		variables: { input: (data && data.hacker.id) || '' },
	});
	const { data: { signedReadUrl = '' } = {} } = fileReadUrlQuery || {};

	if (loading) return <Spinner />;

	// Handle missing ID separately from error
	if (!match.params.id) throw new Error('HackerView rendered with no hacker id provided');
	if (error) throw error;

	// If an ID was provided, no error was thrown, and it's not loading, then we have a weird problem.
	if (!data) throw new Error('No error was thrown, but no data was found either :(');

	const { hacker } = data;

	return (
		<Layout>
			<Button large icon={back} iconAlt="left arrow" onClick={() => props.history.goBack()}>
				Back to table
			</Button>
			<Title
				margin="0.25rem"
				fontSize="1.5rem"
				textAlign="center"
				color={STRINGS.DARKEST_TEXT_COLOR}>
				Application
			</Title>
			<HorizontalLine />
			<StyledTable>
				<tbody>
					{appConfig
						.flatMap(el => el.fields as ConfigField[])
						.map(({ fieldName, title: fieldTitle }) => {
							if (fieldName === 'resume') {
								return (
									<DangerousRow
										key={fieldName}
										label={`${fieldTitle}:`}
										value={
											signedReadUrl.length > 0
												? `<a href="${signedReadUrl}"  target="_blank" rel="noopener noreferrer">Resume Link</a>`
												: 'Not provided'
										}
									/>
								);
							}

							const value =
								hacker.application.find(el => el.question === fieldName)?.answer ?? 'Not provided';

							if (
								['codeOfConduct', 'infoSharingConsent' /* , 'hackathonWaiver' */].includes(
									fieldName
								)
							) {
								return (
									<Row
										key={fieldName}
										label={`${fieldTitle}:`}
										value={value !== 'Not Provided' ? 'Yes' : 'No'}
									/>
								);
							}

							return <Row key={fieldName} label={`${fieldTitle}:`} value={value} />;
						})}
				</tbody>
			</StyledTable>
		</Layout>
	);
};

export default HackerView;
