import React, { FunctionComponent } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import { gql } from 'apollo-boost';
import { Query } from 'react-apollo';
import { useQuery } from 'react-apollo-hooks';
import { Spinner } from '../../components/Loading/Spinner';
import { GraphQLErrorMessage } from '../../components/Text/ErrorMessage';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import TextButton from '../../components/Buttons/TextButton';
import { OverflowContainer, FlexRow, FlexColumn } from '../../components/Containers/FlexContainers';
import 'chartjs-plugin-datalabels';
import STRINGS from '../../assets/strings.json';

const GET_STATISTICS = gql`
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

// TODO(alan): Remove any
const barStatusData = (data: any) => {
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

const barStatusOptions = {
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

const pieShirtData = (data: any) => {
	const shirtData = Object.values(data).slice(0, -1);
	const shirtLabels = Object.keys(data).slice(0, -1);
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

const pieGenderData = (data: any) => {
	const genderData = Object.values(data).slice(0, -1);
	const genderLabels = Object.keys(data).slice(0, -1);
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

export const OrganizerDash: FunctionComponent = (): JSX.Element => {
	const { loading, error, data } = useQuery(GET_STATISTICS, {
		variables: { number: 5.0 },
	});

	if (loading) return <Spinner />;
	if (error) {
		console.log(error);
		return <GraphQLErrorMessage text={STRINGS.GRAPHQL_ORGANIZER_ERROR_MESSAGE} />;
	}
	console.log(data);
	return (
		<OverflowContainer>
			<FloatingPopup marginBottom="1rem" backgroundOpacity="1" padding="1.5rem">
				<Bar data={barStatusData(data.getAllHackerStatuses)} options={barStatusOptions} />
				<Link style={{ textDecoration: 'none' }} to="/managehackers">
					<TextButton
						color="white"
						fontSize="1.4em"
						background={STRINGS.ACCENT_COLOR}
						text="Manage hackers"
						glowColor="rgba(0, 0, 255, 0.67)"
					/>
				</Link>
			</FloatingPopup>
			<FloatingPopup backgroundOpacity="1" padding="1.5rem">
				<FlexRow>
					<FlexColumn>
						<Pie data={pieShirtData(data.getAllHackerSizes)} options={pieShirtOptions} />
					</FlexColumn>
					<FlexColumn>
						<Pie data={pieGenderData(data.getAllHackerGenders)} options={pieGenderOptions} />
					</FlexColumn>
				</FlexRow>
			</FloatingPopup>
		</OverflowContainer>
	);
};

export default OrganizerDash;
