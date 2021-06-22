import React, { FC } from 'react';
import { Bar, Pie, ChartData } from 'react-chartjs-2';
import { gql, useQuery } from '@apollo/client';
import styled from 'styled-components';
import { ChartData as ChartJSData, ChartOptions } from 'chart.js';

import { Spinner } from '../../components/Loading/Spinner';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import { Button } from '../../components/Buttons/Button';
import { OverflowContainer } from '../../components/Containers/FlexContainers';
import 'chartjs-plugin-datalabels';
import STRINGS from '../../assets/strings.json';

const Label = styled('span')`
	font-size: 1.25rem;
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	color: ${STRINGS.DARK_TEXT_COLOR};
`;

const Value = styled(Label)`
	font-weight: 100;
`;

const StyledUL = styled.ul`
	font-size: 1rem;
`;

const StyledLI = styled.li`
	margin-bottom: 0.5rem;
`;

const UpperChartLayout = styled.div`
	display: flex;
	gap: 2rem;
`;

const BarChartLayout = styled.div`
	flex: 1 1 70%;
`;

const StyledFloatingPopupTop = styled(FloatingPopup)`
	display: flex;
	flex-direction: column;
`;

const StyledFloatingPopupBottom = styled(FloatingPopup)`
	display: flex;
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

const generateColor = (n: number): string[] => {
	const ret = new Array(n);
	for (let i = 0; i < n; i += 1) ret[i] = colorPalette[i % colorPalette.length];
	return ret;
};

const STATUS_DEFAULT_CHART_OPTIONS: ChartOptions = {
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

const KVData = (data: { [key: string]: number }): ChartData<ChartJSData> => {
	const keys = Object.keys(data).slice(0, -1);
	const values = Object.values(data).slice(0, -1);

	return {
		datasets: [
			{
				backgroundColor: generateColor(values.length),
				data: values,
			},
		],
		labels: keys,
	};
};

const pieChartOptions = (title: string): ChartOptions => ({
	legend: {
		position: 'right',
	},
	maintainAspectRatio: true,
	responsive: true,
	title: {
		display: true,
		fontSize: 24,
		position: 'bottom',
		text: title,
	},
});

interface SchoolTableProps {
	data: [{ counts: number; school: string }];
}

export const SchoolTable: FC<SchoolTableProps> = ({ data }): JSX.Element => (
	<StyledUL>
		{data.map(d => (
			<StyledLI key={d.school}>
				<Label>{`${d.school}: `}</Label>
				<Value>{d.counts}</Value>
			</StyledLI>
		))}
	</StyledUL>
);

const REDUCED_MOTION_CHART_OPTIONS: ChartOptions = {
	animation: {
		duration: 0, // general animation time
	},
	hover: {
		animationDuration: 0, // duration of animations when hovering an item
	},
	responsiveAnimationDuration: 0, // animation duration after a resize
};

export interface Props {
	disableAnimations?: boolean;
}

export const OrganizerDash: FC<Props> = ({ disableAnimations }): JSX.Element => {
	// TODO(leonm1/tangck): Fix queries to show real data. Should also clean up imports when done.
	// Currently the { loading: true } will stop this component from causing errors in prod.
	// const { loading, error, data } = { data: {} as any, error: 'Not Implemented', loading: true };
	const { loading, error, data } = useQuery(GET_STATISTICS, {
		variables: { number: 5.0 },
	});

	if (loading) return <Spinner />;
	if (error) {
		console.log(error);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}

	let statusOptions = STATUS_DEFAULT_CHART_OPTIONS;
	let shirtOptions = pieChartOptions('T-Shirt Sizes');
	let genderOptions = pieChartOptions('Gender');
	if (disableAnimations) {
		statusOptions = { ...statusOptions, ...REDUCED_MOTION_CHART_OPTIONS };
		shirtOptions = { ...shirtOptions, ...REDUCED_MOTION_CHART_OPTIONS };
		genderOptions = { ...genderOptions, ...REDUCED_MOTION_CHART_OPTIONS };
	}
	return (
		<OverflowContainer>
			<StyledFloatingPopupTop marginBottom="1rem" backgroundOpacity="1" padding="1.5rem">
				<UpperChartLayout>
					<BarChartLayout>
						<Bar data={KVData(data.getAllHackerStatuses)} options={statusOptions} />
					</BarChartLayout>
					<SchoolTable data={data.getTopHackerSchools} />
				</UpperChartLayout>
				<Button large linkTo="/managehackers">
					Manage hackers
				</Button>
			</StyledFloatingPopupTop>
			<StyledFloatingPopupBottom backgroundOpacity="1" padding="1.5rem">
				<Pie data={KVData(data.getAllHackerSizes)} options={shirtOptions} />
				<Pie data={KVData(data.getAllHackerGenders)} options={genderOptions} />
			</StyledFloatingPopupBottom>
		</OverflowContainer>
	);
};

export default OrganizerDash;
