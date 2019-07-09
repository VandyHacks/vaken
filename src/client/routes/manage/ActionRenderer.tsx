import React from 'react';
import { Link } from 'react-router-dom';

import 'react-virtualized/styles.css';
import styled from 'styled-components';

import { RadioSlider } from '../../components/Buttons/RadioSlider';
import { TableButton } from '../../components/Buttons/TableButton';
import { processSliderInput } from './SliderInput';
import { QueriedHacker } from './HackerTableTypes';
import { ApplicationStatus, HackerStatusMutationFn } from '../../generated/graphql';

interface ActionRendererProps {
	rowData: QueriedHacker;
}
const Actions = styled('div')`
	display: flex;
`;

// action column that contains the actionable buttons
export default function actionRenderer(
	updateStatus: HackerStatusMutationFn
): (p: ActionRendererProps) => JSX.Element {
	return function ActionRenderer({ rowData: { id, status } }: ActionRendererProps) {
		let sliderValue: string;
		switch (status) {
			case ApplicationStatus.Accepted:
				sliderValue = 'Accept';
				break;
			case ApplicationStatus.Rejected:
				sliderValue = 'Reject';
				break;
			default:
				sliderValue = 'Undecided';
		}

		return (
			<Actions className="ignore-select">
				<RadioSlider
					option1="Accept"
					option2="Undecided"
					option3="Reject"
					value={sliderValue}
					onChange={(input: string) => {
						const newStatus = processSliderInput(input);
						updateStatus({ variables: { input: { id, status: newStatus } } });
					}}
					disable={
						status !== ApplicationStatus.Accepted &&
						status !== ApplicationStatus.Rejected &&
						status !== ApplicationStatus.Submitted
					}
				/>
				<Link
					style={{ textDecoration: 'none' }}
					to={{ pathname: '/manageHackers/hacker', state: { id } }}>
					<TableButton>View</TableButton>
				</Link>
			</Actions>
		);
	};
}
