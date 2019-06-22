import React, { PureComponent } from 'react';
import { Update } from 'use-immer';
import { Slider, Props as SliderProps } from './Slider';

export class Boolean extends PureComponent<SliderProps, {}> {
	/**
	 * updateFn wraps a setState function to take a react Input event function
	 * and modify the string at `category/fieldName` to represent the updated input
	 * @param {function} setState - function that will update the state
	 * @param {string} category - the category to update
	 * @param {string} fieldName - name of field to update
	 * @returns {function} function suitable for a react input onChange={} prop
	 */
	public static updateFn = (
		setState: Update<string>,
		category: string,
		fieldName: string
	): ((e: React.ChangeEvent<HTMLInputElement>) => void) => {
		return e => {
			const { id } = e.target;
			setState((draft): void => {
				// @ts-ignore: no-implicit-any
				if (!draft[category]) {
					// @ts-ignore: no-implicit-any
					draft[category] = {};
				}
				// @ts-ignore: no-implicit-any
				draft[category][fieldName] = id === 'Yes';
			});
		};
	};

	public render(): JSX.Element {
		const { value, ...rest } = this.props;
		return <Slider options={['Yes', 'No']} value={value ? 'Yes' : 'No'} {...rest} />;
	}
}

export default Boolean;
