import React from 'react';
import styled from 'styled-components';
import { Update } from 'use-immer';
import { AppField } from '../../routes/application/ApplicationConfig';
import UncheckedSvg from '../../assets/img/unchecked_box.svg?inline';
import CheckedSvg from '../../assets/img/checked_box.svg?inline';

interface Props extends AppField {
	options?: string[];
	children?: React.ReactNode;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value: any;
	name: string;
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
	}

	svg {
		margin-right: 0.6rem;
	}

	div {
		margin-bottom: 0.24rem;
	}
`;

export class Checkbox extends React.PureComponent<Props, {}> {
	/**
	 * updateFn wraps a setState function to take a react Input event function
	 * and modify the Set at `category/fieldName` to represent the updated input
	 * @param {function} setState - function that will update the state
	 * @param {string} category - the category to update
	 * @param {string} fieldName - name of field to update
	 * @returns {function} function suitable for a react input onChange={} prop
	 */
	public static updateFn = (
		setState: Update<any>,
		category: string,
		fieldName: string
	): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
		return (e): void => {
			const { type, checked, id } = e.target;
			if (type === 'checkbox') {
				setState((draft): void => {
					if (!draft[category]) {
						draft[category] = {};
					}
					if (!(draft[category][fieldName] instanceof Set)) {
						draft[category][fieldName] = new Set<string>();
					}

					/* Get around Immer's lack of native support for Set/Map by duplicating the 
				 set and changing the necessary fields, then changing the pointer to the new set. */
					const newSet = new Set(draft[category][fieldName]);
					if (checked) {
						newSet.add(id);
					} else {
						newSet.delete(id);
					}

					draft[category][fieldName] = newSet;
				});
			} else {
				throw new Error('Wrong type passed to formChangeWrapper');
			}
		};
	};

	public render(): JSX.Element {
		const { options = ['default'], onChange } = this.props;
		let { value } = this.props;

		if (!(value instanceof Set)) {
			value = new Set();
		}

		return (
			<fieldset>
				<CheckboxContainer>
					{options.map(
						(option: string): JSX.Element => {
							return (
								<div key={option}>
									<input
										checked={value.has(option)}
										type="checkbox"
										id={option}
										onChange={onChange}
									/>
									<label htmlFor={option}>
										{value.has(option) ? (
											<CheckedSvg width={24} height={24} />
										) : (
											<UncheckedSvg width={24} height={24} />
										)}
										{option}
									</label>
								</div>
							);
						}
					)}
				</CheckboxContainer>
			</fieldset>
		);
	}
}

export default Checkbox;
