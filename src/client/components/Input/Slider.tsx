import React, { FC, FormEventHandler } from 'react';
import styled from 'styled-components';
import { title } from 'case';
import { InputProps } from './TextInput';

export interface Props extends InputProps {
	options?: string[];
	titleCase?: boolean;
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
		white-space: nowrap;
	}

	input:checked + label {
		background-color: #6979f8;
		color: #ffffff;
		/* border-color: #6979f8; */
		z-index: 1;
	}

	input:not(:checked):focus + label {
		/* Color for keyboard users */
		box-shadow: inset 0 0 2px 2px #6979f8;
	}
`;

export const SliderSansTitleCase: FC<Props> = ({ value, setState, titleCase, ...props }) => {
	const onChange: FormEventHandler<HTMLInputElement> = ({ currentTarget: { id } }) =>
		setState(id === value ? '' : id);

	const { options = ['default'], className } = props;
	return (
		<fieldset>
			<SliderContainer className={className}>
				{options.map(
					(option: string): JSX.Element => (
						<React.Fragment key={option}>
							<input checked={value === option} type="radio" id={option} onChange={onChange} />
							<label htmlFor={option}>{titleCase ? title(option) : option}</label>
						</React.Fragment>
					)
				)}
			</SliderContainer>
		</fieldset>
	);
};

// Default export should use good title case conventions.
export const Slider: FC<Props> = props => <SliderSansTitleCase titleCase {...props} />;

export default Slider;
