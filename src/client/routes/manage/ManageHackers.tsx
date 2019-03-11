import React from 'react';
import HackerTable from './HackerTable';
import hackerData from '../../assets/hackerData.json';
import FloatingPopup from '../../components/Containers/FloatingPopup';

const ManageHackers = (): JSX.Element => {
	// GraphQL query would go here
	const tableData = hackerData;
	// const tableData = JSON.parse(hackerData.toString(), (key, value) => {
	// 	return value;
	// });

	return (
		<>
			<FloatingPopup
				borderRadius="1rem"
				height="100%"
				backgroundOpacity="1"
				padding="1.5rem"
				>
				<HackerTable data={tableData} />
			</FloatingPopup>
		</>
	);
};

export default ManageHackers;

// Copyright (c) 2019 Vanderbilt University
