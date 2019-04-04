import React, { FunctionComponent } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Link } from 'react-router-dom';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import TextButton from '../../components/Buttons/TextButton';
import { FlexRow, FlexColumn } from '../../components/Containers/FlexContainers';
import 'chartjs-plugin-datalabels';
import STRINGS from '../../assets/strings.json';

interface Props {}

const colorPalette = STRINGS.COLOR_PALETTE.slice(1);

const generateColor = (n: number): string[] =>
	[...Array(n).keys()].map((i: number) => colorPalette[i % colorPalette.length]);

const statusLabels = ['Verified', 'Started', 'Submitted', 'Accepted', 'Confirmed', 'Rejected'];
const statusData = [22, 43, 230, 176, 89, 3];

const shirtLabels = ['Unisex S', 'Unisex M', 'Unisex L', "Women's S", "Women's M", "Women's L"];
const shirtData = [83, 40, 58, 60, 23, 51];

const genderLabels = ['Female', 'Male', 'Non-Binary', 'Prefer Not to Say'];
const genderData = [49, 73, 12, 23];

const barStatusData = {
	datasets: [
		{
			backgroundColor: generateColor(statusData.length),
			data: statusData,
		},
	],
	labels: statusLabels,
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

const pieShirtData = {
	datasets: [
		{
			backgroundColor: generateColor(shirtData.length),
			data: shirtData,
		},
	],
	labels: shirtLabels,
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

const pieGenderData = {
	datasets: [
		{
			backgroundColor: generateColor(shirtData.length),
			data: genderData,
		},
	],
	labels: genderLabels,
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

export const OrganizerDash: FunctionComponent = (props: Props): JSX.Element => {
	return (
		<>
			<FloatingPopup width="60rem" marginBottom="1rem" backgroundOpacity="1" padding="1.5rem">
				<Bar data={barStatusData} options={barStatusOptions} />
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
			<FloatingPopup width="60rem" backgroundOpacity="1" padding="1.5rem">
				<FlexRow>
					<FlexColumn>
						<Pie data={pieShirtData} options={pieShirtOptions} />
					</FlexColumn>
					<FlexColumn>
						<Pie data={pieGenderData} options={pieGenderOptions} />
					</FlexColumn>
				</FlexRow>
			</FloatingPopup>
		</>
	);
};

export default OrganizerDash;
