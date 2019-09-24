import React, { FC } from 'react';
import styled from 'styled-components';
import { title } from 'case';
import UncheckedSvg from '../../assets/img/unchecked_box.svg';
import CheckedSvg from '../../assets/img/checked_box.svg';
import { InputProps } from './TextInput';

const SEPARATOR = '|';

interface Props extends InputProps {
	options?: string[];
}

const CheckboxContainer = styled.div`
	font-size: 0;
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	border-radius: 6px;

	input {
		width: 0;
		height: 0;
		position: absolute;
		left: -9999px;

		&:focus + label img {
			/* Color for keyboard users */
			box-shadow: 0 0 2px 2px #6979f8;
		}
	}

	label {
		display: flex;
		flex-flow: row nowrap;
		justify-content: flex-start;
		align-items: center;
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

export const CheckboxSansTitleCase: FC<Props> = ({
	value,
	options = ['default'],
	setState,
}: Props) => {
	const selected = value.length ? new Set(value.split(SEPARATOR)) : new Set();
	const onChange = ({ currentTarget: { id } }: React.FormEvent<HTMLInputElement>): void => {
		if (selected.has(id)) selected.delete(id);
		else selected.add(id);

		setState(Array.from(selected).join(SEPARATOR));
	};

	return (
		<fieldset>
			<CheckboxContainer>
				{options.map(
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
									<p>{option}</p>
								</label>
							</div>
						);
					}
				)}
			</CheckboxContainer>
		</fieldset>
	);
};

export const Checkbox: FC<Props> = props => {
	const { options, ...rest } = props;
	return <CheckboxSansTitleCase options={(options || []).map(title)} {...rest} />;
};

export default Checkbox;
