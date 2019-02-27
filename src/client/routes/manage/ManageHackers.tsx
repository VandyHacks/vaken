import React from 'react';
import HackerTable from './HackerTable';
import hackerData from '../../assets/hackerData.json';

const ManageHackers = (): JSX.Element => {
	// GraphQL query would go here
	const tableData = hackerData;

	return (
		<>
			<HackerTable data={tableData} />
		</>
	);
};

export default ManageHackers;

// Copyright (c) 2019 Vanderbilt University
