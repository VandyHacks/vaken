import React, { FunctionComponent } from 'react';
import { Update } from 'use-immer';
import Slider, { Props as SliderProps } from './Slider';

interface Props extends SliderProps {}

export class Boolean extends React.PureComponent<Props, {}> {
	private options = ['Yes', 'No'];

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
			setState(draft => {
				if (!draft[category]) {
					draft[category] = {};
				}

				draft[category][fieldName] = id === 'Yes';
			});
		};
	};

	public render() {
		const { value, ...rest } = this.props;
		return <Slider options={this.options} value={value ? 'Yes' : 'No'} {...rest} />;
	}
}

export default Boolean;
