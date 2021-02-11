import React, { FC } from 'react';
import 'react-virtualized/styles.css';
import styled from 'styled-components';
import { MutationFunction } from '@apollo/client';
import { RadioSlider } from '../../components/Buttons/RadioSlider';
import { Button } from '../../components/Buttons/Button';
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

export interface ActionRendererProps {
	rowData: Pick<QueriedHacker, 'id' | 'status'>;
}
const Actions = styled('div')`
	display: flex;
	justify-content: flex-end;
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
export function createActionRenderer(
	updateStatus: (s: { status: ApplicationStatus; id: string }) => Promise<void>
): FC<ActionRendererProps> {
	return function ActionRenderer({ rowData: { id, status } }) {
		return (
			<Actions className="ignore-select">
				{status && status !== ApplicationStatus.Created && status !== ApplicationStatus.Started ? (
					<RadioSlider
						option1="Accept"
						option2="Undecided"
						option3="Reject"
						value={convertApplicationStatus(status)}
						onChange={(input: string) => {
							const newStatus = processSliderInput(input);
							updateStatus({ status: newStatus, id });
						}}
						disable={!enableApplicationStatusSlider(status)}
					/>
				) : (
					<></>
				)}
				{status && status !== ApplicationStatus.Created && (
					<Button small outline linkTo={`${window.location.pathname}/detail/${id}`}>
						View
					</Button>
				)}
			</Actions>
		);
	};
}
