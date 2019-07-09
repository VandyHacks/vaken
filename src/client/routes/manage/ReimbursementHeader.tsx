import React from 'react';
import { SortIndicator, TableHeaderProps } from 'react-virtualized';
import 'react-virtualized/styles.css';

import plane from '../../assets/img/plane.svg';

// renders an svg instead of a text label, will with a clickable sort indicator
const renderHeaderAsSVG = (
	{ dataKey, sortBy, sortDirection, label }: TableHeaderProps,
	svg: string
): JSX.Element => {
	return (
		<>
			<img alt={String(label)} src={svg} />
			{sortBy === dataKey && <SortIndicator sortDirection={sortDirection} />}
		</>
	);
};

// header renderer for travel reimbursement part of table
export const reimbursementHeaderRenderer = ({
	dataKey,
	sortBy,
	sortDirection,
	label,
}: TableHeaderProps): JSX.Element =>
	renderHeaderAsSVG(
		{
			dataKey,
			label,
			sortBy,
			sortDirection,
		},
		plane
	);

export default {
	reimbursementHeaderRenderer,
};
