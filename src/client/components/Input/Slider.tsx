import React, { FC, FormEventHandler } from 'react';
import styled from 'styled-components';

export interface Props {
	options?: string[];
	setState: (value: string) => void;
	value: string;
}

const SliderContainer = styled.div`
	font-size: 0;
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	background: #ffffff;
	border-radius: 6px;
	width: min-content;
	height: min-content;

	input {
		width: 0;
		height: 0;
		position: absolute;
		left: -9999px;
	}

	label {
		cursor: pointer;
		padding: 0.75rem 2rem;
		margin-top: 0;
		box-sizing: border-box;
		display: inline-block;
		border-radius: 6px;
		background-color: #fff;
		line-height: 140%;
		text-align: center;
		font-size: 1rem;
		transition: color 0.2s ease-out, background-color 0.15s ease-out, box-shadow 0.15s ease-out;
	}

	input:checked + label {
		background-color: #6979f8;
		color: #ffffff;
		/* border-color: #6979f8; */
		z-index: 1;
	}
`;

export const Slider: FC<Props> = ({ options = ['default'], value, setState }: Props) => {
	const onChange: FormEventHandler<HTMLInputElement> = ({ currentTarget: { id } }) =>
		setState(id === value ? '' : id);

	return (
		<fieldset>
			<SliderContainer>
				{options.map(
					(option: string): JSX.Element => {
						return (
							<React.Fragment key={option}>
								<input checked={value === option} type="radio" id={option} onChange={onChange} />
								<label htmlFor={option}>{option}</label>
							</React.Fragment>
						);
					}
				)}
			</SliderContainer>
		</fieldset>
	);
};
export default Slider;
