import React, { FC } from 'react';

import { MutationFunction } from '@apollo/react-common';
import { RadioSlider } from '../../components/Buttons/RadioSlider';
import { QueriedHacker } from './HackerTableTypes';
import {
	ApplicationStatus,
	HackerStatusesMutation,
	HackerStatusesMutationVariables,
} from '../../generated/graphql';

// Work around graphql-code-generator not yet working with
// the separate @apollo/react-common package in 3.0.0.
export type HackerStatusesMutationFn = MutationFunction<
	HackerStatusesMutation,
	HackerStatusesMutationVariables
>;

export interface DeselectElement extends HTMLDivElement {
	context: {
		selectable: {
			clearSelection: () => void;
		};
	};
}

// maps the radio slider labels to the hacker status
export const processSliderInput = (input: string): ApplicationStatus => {
	switch (input.toLowerCase()) {
		case 'accept':
			return ApplicationStatus.Accepted;
		case 'reject':
			return ApplicationStatus.Rejected;
		case 'undecided':
		default:
			return ApplicationStatus.Submitted;
	}
};

interface SliderInputProps {
	deselect: React.RefObject<DeselectElement>;
	selectedRowsIds: string[];
	sortBy?: keyof QueriedHacker;
	updateStatuses: HackerStatusesMutationFn;
}

export const SliderInput: FC<SliderInputProps> = ({
	updateStatuses,
	deselect,
	selectedRowsIds,
	sortBy,
}) => {
	return (
		<RadioSlider
			option1="Accept"
			option2="Undecided"
			option3="Reject"
			large
			value="Undecided"
			onChange={(input: string) => {
				const newStatus = processSliderInput(input);
				updateStatuses({
					variables: { input: { ids: selectedRowsIds, status: newStatus } },
				});
				// to deselect afterwards, react-selectable-fast has no clean way to interface with a clearSelection function
				// so this is a workaround by simulating a click on the SelectAllButton
				if (
					sortBy === 'status' &&
					deselect &&
					deselect.current &&
					deselect.current.context &&
					deselect.current.context.selectable
				) {
					deselect.current.context.selectable.clearSelection();
				}
			}}
		/>
	);
};

export default {
	SliderInput,
};
