import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';

const Label = styled('label')`
	display: inline-flex;
	align-items: center;
	font-size: 1rem;
`;

const Switch = styled('div')`
	position: relative;
	display: inline-block;
	width: 3.5rem;
	height: 2rem;
	margin-left: 0.25rem;
`;

interface SliderProps {
	checked: boolean;
}

const Slider = styled('div')`
	${({ checked }: SliderProps): string =>
		checked
			? `background-color: ${STRINGS.ACCENT_COLOR}; &:before { transform: translateX(1.5rem); }`
			: 'background-color: #ccc;'}
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	transition: 0.4s;
	border-radius: 2.125rem;
	:before {
		border-radius: 50%;
		position: absolute;
		content: '';
		height: 1.5rem;
		width: 1.5rem;
		left: 0.25rem;
		bottom: 0.25rem;
		background-color: white;
		transition: 0.4s;
		${({ checked }: SliderProps): string =>
			checked
				? 'box-shadow: 0rem 0.1875rem 0.1875rem 0rem #5E6DDF'
				: 'box-shadow: 0rem 0.1875rem 0.1875rem 0rem #9b9b9b'}
	}
`;

interface Props {
	checked: boolean;
	label: string;
	onChange?: (value: boolean) => void;
}

export const ToggleSwitch: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const {
		label,
		checked,
		onChange = (): void => {
			/* Do nothing */
		},
	} = props;
	return (
		<Label>
			{label}
			<Switch onClick={(): void => onChange(!checked)}>
				<Slider checked={checked} />
			</Switch>
		</Label>
	);
};

export default ToggleSwitch;
