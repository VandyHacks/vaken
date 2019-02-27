import React from 'react';
import styled from 'styled-components';
import { FlexRow, FlexColumn } from '../../components/Containers/FlexContainers';
import Sidebar from '../../components/Sidebar/Sidebar';
import 'chartjs-plugin-datalabels';
import TextButton from '../../components/Buttons/TextButton';
import STRINGS from '../../assets/strings.json';
import Title from '../../components/Text/Title';
import FloatingPopup from '../../components/Containers/FloatingPopup';
import HackerTable from './HackerTable';
import hackerData from './hackerData.json';

const Layout = styled.div`
	height: 100vh;
	width: 100vw;
	display: grid;
	/* grid-gap: 2rem; */
	grid:
		'sidebar . header' 10vh
		'sidebar . .' 1rem
		'sidebar . content' 1fr
		/ 22rem 2rem 1fr;
	/* align-items: stretch; */
	overflow: hidden;

	.content {
		overflow-y: scroll;
		border-radius: 2rem;
	}
`;

const Rectangle = styled.div`
	height: 0.4rem;
	width: 7.5rem;
	background: ${STRINGS.ACCENT_COLOR};
`;

const ManageHackers = (): JSX.Element => {
	// GraphQL query would go here
	const tableData = hackerData;
	console.log(tableData);

	return (
		<>
			<Layout>
				<div style={{ gridArea: 'header' }}>
					<Title color={STRINGS.ACCENT_COLOR} margin="1.5rem 0rem 0rem">
						Manage Hackers
					</Title>
					<Rectangle />
				</div>
				<Sidebar />
				<div className="content" style={{ gridArea: 'content' }}>
					<FloatingPopup width="60rem" backgroundOpacity="1" padding="1.5rem">
						<HackerTable data={tableData} />
						{/* <HackerTable2/> */}
					</FloatingPopup>
				</div>
			</Layout>
		</>
	);
};

export default ManageHackers;

// Copyright (c) 2019 Vanderbilt University
