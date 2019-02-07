import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import Sidebar from '../../components/Sidebar/Sidebar';

const Layout = styled.div`
	height: 100vh;
	width: 100vw;
	display: grid;
	grid-gap: 2rem;
	grid:
		'sidebar header' 10vh
		'sidebar content' 1fr
		/ 18rem 1fr;
`;

const Dashboard = (): JSX.Element => {
	let statusData = {
		datasets: [
			{
				backgroundColor: [
					'rgba(219, 165, 245, 1)',
					'rgba(255, 199, 166, 1)',
					'rgba(255, 226, 157, 1)',
					'rgba(125, 223, 195, 1)',
					'rgba(165, 175, 251, 1)',
					'rgba(253, 175, 187, 1)',
				],
				data: [22, 43, 230, 176, 89, 3],
			},
		],
		labels: ['Verified', 'Started', 'Submitted', 'Accepted', 'Confirmed', 'Rejected'],
	};

	return (
		<>
			<Layout>
				<Sidebar />
				<FloatingPopup height="60rem" width="56rem" opacity={1} gridArea="content">
					<Bar
						data={statusData}
						options={{
							hover: {
								mode: undefined,
							},
							legend: {
								display: false,
							},
							maintainAspectRatio: true,
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
								enabled: true,
							},
						}}
					/>
				</FloatingPopup>
			</Layout>
		</>
	);
};

export default Dashboard;
