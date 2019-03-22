import React, { FunctionComponent, useState, useEffect } from 'react';
import { Update } from 'use-immer';
import styled from 'styled-components';
import { AppField } from '../../routes/application/ApplicationConfig';

export interface Props extends AppField {
	options?: string[];
	children?: React.ReactNode;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	value: any;
	name: string;
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

export class Slider extends React.PureComponent<Props, {}> {
	/**
	 * updateFn wraps a setState function to take a react Input event function
	 * and modify the string at `category/fieldName` to represent the updated input
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
		return e => {
			const { type, checked, id } = e.target;
			if (type === 'radio') {
				setState(draft => {
					if (!draft[category]) {
						draft[category] = {};
					}

					draft[category][fieldName] = id;
				});
			} else {
				throw new Error('Wrong type passed to formChangeWrapper');
			}
		};
	};

	public render() {
		const { options = ['default'], value, onChange } = this.props;

		return (
			<fieldset>
				<SliderContainer>
					{options.map((option: string) => {
						return (
							<React.Fragment key={option}>
								<input checked={value == option} type="radio" id={option} onChange={onChange} />
								<label htmlFor={option}>{option}</label>
							</React.Fragment>
						);
					})}
				</SliderContainer>
			</fieldset>
		);
	}
}

export default Slider;
