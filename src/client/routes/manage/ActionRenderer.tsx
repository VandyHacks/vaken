import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import { MutationFunction } from '@apollo/react-common';
import { RadioSlider } from '../../components/Buttons/RadioSlider';
import { TableButton } from '../../components/Buttons/TableButton';
import { processSliderInput } from './SliderInput';
import { QueriedHacker } from './HackerTableTypes';
import {
	ApplicationStatus,
	HackerStatusMutation,
	HackerStatusMutationVariables,
} from '../../generated/graphql';

// Work around graphql-code-generator not yet working with
// the separate @apollo/react-common package in 3.0.0.
export type HackerStatusMutationFn = MutationFunction<
	HackerStatusMutation,
	HackerStatusMutationVariables
>;

interface ActionRendererProps {
	rowData: QueriedHacker;
}
const Actions = styled('div')`
	display: flex;
`;

function enableApplicationStatusSlider(status: string): boolean {
	return ([ApplicationStatus.Rejected, ApplicationStatus.Submitted] as string[]).includes(status);
}

export function convertApplicationStatus(status: ApplicationStatus): string {
	switch (status) {
		case ApplicationStatus.Confirmed:
		case ApplicationStatus.Accepted:
			return 'Accept';
		case ApplicationStatus.Rejected:
			return 'Reject';
		default:
			return 'Undecided';
	}
}

// action column that contains the actionable buttons
export function actionRenderer(updateStatus: HackerStatusMutationFn): FC<ActionRendererProps> {
	return function ActionRenderer({ rowData: { id, status } }) {
		return (
			<Actions className="ignore-select">
				<RadioSlider
					option1="Accept"
					option2="Undecided"
					option3="Reject"
					value={convertApplicationStatus(status)}
					onChange={(input: string) => {
						const newStatus = processSliderInput(input);
						updateStatus({ variables: { input: { id, status: newStatus } } });
					}}
					disable={!enableApplicationStatusSlider(status)}
				/>
				<Link style={{ textDecoration: 'none' }} to={{ pathname: `/manage/hackers/detail/${id}` }}>
					<TableButton>View</TableButton>
				</Link>
			</Actions>
		);
	};
}
