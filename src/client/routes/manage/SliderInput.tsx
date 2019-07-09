import React from 'react';

import { RadioSlider } from '../../components/Buttons/RadioSlider';
import { ApplicationStatus } from '../../generated/graphql';

export interface DeselectElement extends HTMLDivElement {
	context: {
		selectable: {
			clearSelection: () => void;
		};
	};
}

// maps the radio slider labels to the hacker status
const processSliderInput = (input: string): ApplicationStatus => {
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
	updateStatuses: Function;
	selectedRowsEmails: string[];
	sortBy: undefined as keyof HackersQuery['hackers'][0] | undefined;
};

export const SliderInput = ({
	updateStatuses,
	deselect,
	selectedRowsEmails,
	sortBy,
}: SliderInputProps): JSX.Element => {
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
					variables: { input: { ids: selectedRowsEmails, status: newStatus } },
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
