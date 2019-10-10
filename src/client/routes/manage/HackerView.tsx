import React, { FC } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';
import { Spinner } from '../../components/Loading/Spinner';
import STRINGS from '../../assets/strings.json';
import { Title } from '../../components/Text/Title';
import LeftImgButton from '../../components/Buttons/LeftImgButton';
import back from '../../assets/img/back.svg';
import { useDetailedHackerQuery } from '../../generated/graphql';
import appConfig from '../../assets/application';
import { ConfigField } from '../application/Application';

const Layout = styled.div`
	display: flex;
	flex-flow: column nowrap;
	width: 100%;
	max-height: 100%;
	overflow-y: auto;
`;

const StyledTable = styled('table')`
	border-spacing: 0.5rem;
	border-collapse: separate;
	overflow: auto;
	height: 100%;
`;

const HorizontalLine = styled.hr`
	margin: 0 2rem;
	border: 0.0625rem solid ${STRINGS.ACCENT_COLOR};
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

const Row: FC<{ label: string; value: string }> = props => {
	const { label, value } = props;
	// TODO: Make '|' a constant.
	const text = value.includes('|') ? (
		value.split('|').map(val => <p key={val}>{val}</p>)
	) : (
		<p>{value}</p>
	);

	return (
		<TableRow>
			<Label>{label}</Label>
			<Value>{text}</Value>
		</TableRow>
	);
};

export const HackerView: FC<RouteComponentProps<{ id: string }, {}, {}>> = props => {
	const { match } = props;
	const { data, loading, error } = useDetailedHackerQuery({ variables: { id: match.params.id } });

	if (loading) return <Spinner />;

	// Handle missing ID separately from error
	if (!match.params.id) throw new Error('HackerView rendered with no hacker id provided');
	if (error) throw error;

	// If an ID was provided, no error was thrown, and it's not loading, then we have a weird problem.
	if (!data) throw new Error('No error was thrown, but no data was found either :(');

	const { hacker } = data;

	return (
		<Layout>
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
							const value =
								(hacker.application.find(el => el.question === fieldName) || { answer: '' })
									.answer || 'Not provided';
							return <Row key={fieldName} label={`${fieldTitle}:`} value={value} />;
						})}
				</tbody>
			</StyledTable>
		</Layout>
	);
};

export default HackerView;
