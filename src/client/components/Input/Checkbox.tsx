import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { title } from 'case';
import UncheckedSvg from '../../assets/img/unchecked_box.svg';
import CheckedSvg from '../../assets/img/checked_box.svg';
import { InputProps } from './TextInput';
import STRINGS from '../../assets/strings.json';

const SEPARATOR = '|';

interface Props extends InputProps {
	options?: string[];
}

const CheckboxContainer = styled.div`
	font-size: 0;
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	border-radius: 4px;

	input {
		width: 0;
		height: 0;
		position: absolute;
		left: -9999px;

		&:focus + label img {
			/* Color for keyboard users */
			box-shadow: 0 0 2px 2px ${STRINGS.ACCENT_COLOR};
		}
	}

	label {
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: flex-start;
		line-height: 140%;
		text-align: left;
		font-size: 1.1rem;
		cursor: pointer;

		img {
			margin-right: 0.5rem;
			min-height: 24px;
			max-height: 24px;
			height: 24px;
			min-width: 24px;
			max-width: 24px;
		}
	}

	svg {
		margin-right: 0.6rem;
	}

	div {
		margin-bottom: 0.24rem;
	}
`;

const CheckboxRaw: FC<Props & { titleCase?: boolean }> = ({
	value,
	options = ['default'],
	setState,
	titleCase,
}) => {
	const selected = value?.length ? new Set(value.split(SEPARATOR)) : new Set();
	const onChange = ({ currentTarget: { id } }: React.FormEvent<HTMLInputElement>): void => {
		if (selected.has(id)) selected.delete(id);
		else selected.add(id);

		setState(Array.from(selected).join(SEPARATOR));
	};

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
			<CheckboxContainer>
				{awaitedOptions.map(
					(option: string): JSX.Element => {
						return (
							<div key={option}>
								<input
									checked={selected.has(option)}
									type="checkbox"
									id={option}
									onChange={onChange}
								/>
								<label htmlFor={option}>
									{selected.has(option) ? (
										<img src={CheckedSvg} alt="checked" width="24px" height="24px" />
									) : (
										<img src={UncheckedSvg} alt="unchecked" width="24px" height="24px" />
									)}
									{/* eslint-disable-next-line react/no-danger */}
									<p dangerouslySetInnerHTML={{ __html: titleCase ? title(option) : option }} />
								</label>
							</div>
						);
					}
				)}
			</CheckboxContainer>
		</fieldset>
	);
};

/**
 * Checkbox stores state as a `SEPARATOR`(|)-delimited join of the selected options.
 */
export const CheckboxSansTitleCase: FC<Props> = (props: Props) => <CheckboxRaw {...props} />;

/**
 * Checkbox stores state as a `SEPARATOR`(|)-delimited join of the selected options.
 *
 * Options will not be escaped to allow for HTML markup (links, presumably) in the option text.
 *
 * This component will display the options in title case by default. For a component which does not do this,
 * please use `CheckboxSansTitleCase`.
 */
export const Checkbox: FC<Props> = props => <CheckboxRaw {...props} titleCase />;

export default Checkbox;
