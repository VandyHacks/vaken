import React, { FunctionComponent } from 'react';
import { Bar, Pie, ChartData } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import styled from 'styled-components';
import chartjs, { ChartOptions } from 'chart.js';

import { Spinner } from '../../components/Loading/Spinner';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import TextButton from '../../components/Buttons/TextButton';
import { OverflowContainer, FlexStartColumn } from '../../components/Containers/FlexContainers';
import 'chartjs-plugin-datalabels';
import STRINGS from '../../assets/strings.json';

const Label = styled('span')`
	font-size: 1.25rem;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	color: ${STRINGS.DARK_TEXT_COLOR};
`;

const Value = styled('span')`
	font-size: 1.25rem;
	font-family: 'Roboto', sans-serif;
	font-weight: 100;
	color: ${STRINGS.DARK_TEXT_COLOR};
`;

const StyledUL = styled.ul`
	font-size: 1rem;
`;

const StyledLI = styled.li`
	margin-bottom: 0.5rem;
`;

const StyledTable = styled.div`
	grid-area: table;
`;

const BarLayout = styled.div`
	grid-area: chart;
`;
const LinkLayout = styled(FlexStartColumn)`
	grid-area: link;
`;

const PieLayoutLeft = styled.div`
	grid-area: pie1;
`;

const PieLayoutRight = styled.div`
	grid-area: pie2;
`;

const StyledFloatingPopupTop = styled(FloatingPopup)`
	display: grid;
	grid-template-columns: 70% 2rem auto;
	grid-template-rows: auto auto;
	grid-template-areas:
		'chart . table'
		'link link link';
`;

const StyledFloatingPopupBottom = styled(FloatingPopup)`
	display: grid;
	grid-template-columns: 50% 50%;
	grid-template-rows: auto;
	grid-template-areas: 'pie1 pie2';
`;

export const GET_STATISTICS = gql`
	query Statistics($number: Float!) {
		getAllHackerGenders {
			Male
			Female
			Other
			PreferNotToSay
		}
		getAllHackerSizes {
			UXS
			US
			UM
			UL
			UXL
			UXXL
			WS
			WM
			WL
			WXL
			WXXL
		}
		getAllHackerStatuses {
			Created
			Verified
			Started
			Submitted
			Accepted
			Confirmed
			Rejected
		}
		getTopHackerSchools(number: $number) {
			school
			counts
		}
	}
`;

const colorPalette = STRINGS.COLOR_PALETTE.slice(1);

const generateColor = (n: number): string[] =>
	[...Array(n).keys()].map((i: number) => colorPalette[i % colorPalette.length]);

const barStatusData = (data: { [key: string]: number }): ChartData<chartjs.ChartData> => {
	const statusData = Object.values(data).slice(0, -1);
	const statusLabels = Object.keys(data).slice(0, -1);
	return {
		datasets: [
			{
				backgroundColor: generateColor(statusData.length),
				data: statusData,
			},
		],
		labels: statusLabels,
	};
};

const barStatusOptions: ChartOptions = {
	legend: {
		display: false,
	},
	maintainAspectRatio: true,
	plugins: {
		datalabels: {
			align: 'start',
			anchor: 'end',
			clip: true,
			color: 'black',
			display: 'auto',
			font: {
				size: 20,
				weight: 'bold',
			},
		},
	},
	responsive: true,
	scales: {
		xAxes: [
			{
				ticks: {
					fontSize: 20,
				},
			},
		],
	},
	showLines: true,
	title: {
		display: true,
		fontSize: 24,
		text: 'Number of Applicants',
	},
	tooltips: {
		enabled: false,
	},
};

const pieShirtData = (data: { [key: string]: number }): ChartData<chartjs.ChartData> => {
	const shirtLabels = Object.keys(data).slice(0, -1);
	const shirtData = Object.values(data).slice(0, -1);

	return {
		datasets: [
			{
				backgroundColor: generateColor(shirtData.length),
				data: shirtData,
			},
		],
		labels: shirtLabels,
	};
};

const pieShirtOptions = {
	legend: {
		position: 'right' as 'right',
	},
	maintainAspectRatio: true,
	responsive: true,
	title: {
		display: true,
		fontSize: 24,
		position: 'bottom' as 'bottom',
		text: 'T-Shirt Sizes',
	},
};

const pieGenderData = (data: { [key: string]: number }): ChartData<chartjs.ChartData> => {
	const genderLabels = Object.keys(data).slice(0, -1);
	const genderData = Object.values(data).slice(0, -1);

	return {
		datasets: [
			{
				backgroundColor: generateColor(genderData.length),
				data: genderData,
			},
		],
		labels: genderLabels,
	};
};

const pieGenderOptions = {
	legend: {
		position: 'right' as 'right',
	},
	maintainAspectRatio: true,
	responsive: true,
	title: {
		display: true,
		fontSize: 24,
		position: 'bottom' as 'bottom',
		text: 'Gender',
	},
};

interface Props {
	data: [{ counts: number; school: string }];
}

export const SchoolTable: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const { data } = props;

	return (
		<StyledUL>
			{data.map(d => (
				<StyledLI key={d.school}>
					<Label>{`${d.school}: `}</Label>
					<Value>{d.counts}</Value>
				</StyledLI>
			))}
		</StyledUL>
	);
};

export const OrganizerDash: FunctionComponent = (): JSX.Element => {
	// TODO(leonm1/tangck): Fix queries to show real data. Should also clean up imports when done.
	// Currently the { loading: true } will stop this component from causing errors in prod.
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const { loading, error, data } = { data: {} as any, error: 'Not Implemented', loading: true };
	// const { loading, error, data } = useQuery(GET_STATISTICS, {
	// 	variables: { number: 5.0 },
	// });

	if (loading) return <Spinner />;
	if (error) {
		console.log(error);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	return (
		<OverflowContainer>
			<StyledFloatingPopupTop marginBottom="1rem" backgroundOpacity="1" padding="1.5rem">
				<BarLayout>
					<Bar data={barStatusData(data.getAllHackerStatuses)} options={barStatusOptions} />
				</BarLayout>
				<StyledTable>
					<SchoolTable data={data.getTopHackerSchools} />
				</StyledTable>
				<LinkLayout>
					<Link style={{ textDecoration: 'none' }} to="/managehackers">
						<TextButton
							color="white"
							fontSize="1.4em"
							background={STRINGS.ACCENT_COLOR}
							glowColor="rgba(0, 0, 255, 0.67)">
							<p>Manage hackers</p>
						</TextButton>
					</Link>
				</LinkLayout>
			</StyledFloatingPopupTop>
			<StyledFloatingPopupBottom backgroundOpacity="1" padding="1.5rem">
				<PieLayoutLeft>
					<Pie data={pieShirtData(data.getAllHackerSizes)} options={pieShirtOptions} />
				</PieLayoutLeft>
				<PieLayoutRight>
					<Pie data={pieGenderData(data.getAllHackerGenders)} options={pieGenderOptions} />
				</PieLayoutRight>
			</StyledFloatingPopupBottom>
		</OverflowContainer>
	);
};

export default OrganizerDash;
