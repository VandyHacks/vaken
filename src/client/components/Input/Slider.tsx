import React, { FC, FormEventHandler, useState, useEffect } from 'react';
import styled from 'styled-components';
import { title } from 'case';
import { InputProps } from './TextInput';
import STRINGS from '../../assets/strings.json';

let globalCounter = 0;

export interface Props extends InputProps {
	options?: string[];
	titleCase?: boolean;
}

const SliderContainer = styled.div`
	font-size: 0;
	display: flex;
	flex-flow: row wrap;
	border-radius: 4px;

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
		background: #ffffff;
		border-radius: 4px;
		background-color: #fff;
		line-height: 140%;
		text-align: center;
		font-size: 1rem;
		transition: color 0.2s ease-out, background-color 0.15s ease-out, box-shadow 0.15s ease-out;
		white-space: nowrap;
		flex: 0 1 auto;
	}

	input:checked + label {
		background-color: ${STRINGS.ACCENT_COLOR};
		color: #ffffff;
		/* border-color: #6979f8; */
		z-index: 1;

		svg path {
			fill: ${STRINGS.ACCENT_COLOR};
		}
	}

	input:not(:checked):focus + label {
		/* Color for keyboard users */
		box-shadow: inset 0 0 2px 2px ${STRINGS.ACCENT_COLOR};
	}

	input:checked:focus + label {
		/* Color for keyboard users */
		box-shadow: inset 0 0 2px 2px #ffffff;
	}
`;

export const SliderSansTitleCase: FC<Props> = ({ value, setState, titleCase, ...props }) => {
	const { options = ['default'], className } = props;
	const [counter, setCounter] = useState(0);
	const onChange: FormEventHandler<HTMLInputElement> = ({ currentTarget: { id } }) =>
		setState(id.split('-')[0] === value ? '' : id.split('-')[0]);

	// Generate UID
	useEffect(() => {
		setCounter((globalCounter += 1));
	}, []);

	const [awaitedOptions, setAwaitedOptions] = useState(['Loading...']);

	// Async support for options
	useEffect(() => {
		if (options instanceof Promise) {
			options.then(module => setAwaitedOptions(module.data)).catch(() => setAwaitedOptions([]));
		} else {
			setAwaitedOptions(options);
		}
	}, [options]);

	return (
		<fieldset>
			<SliderContainer className={className}>
				{awaitedOptions.map(
					(option: string): JSX.Element => (
						<React.Fragment key={option}>
							<input
								// tabIndex={0}
								checked={value === option}
								type="radio"
								id={`${option}-${counter}`}
								name={`${option}-${counter}`}
								onChange={onChange}
							/>
							<label htmlFor={`${option}-${counter}`}>{titleCase ? title(option) : option}</label>
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
