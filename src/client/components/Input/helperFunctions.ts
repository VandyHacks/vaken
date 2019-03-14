import produce from 'immer';
import { Update } from 'use-immer';

/**
 * onChangeWrapper wraps a setState function to take a react Input event function
 * @param {function} updateFn - function that will update the state
 * @param {React.Ref} ref - element to validate
 * @returns {function} function suitable for a react input onChange={} prop
 */
export function onChangeWrapper(
	updateFn: (p: string) => void
): (e: React.ChangeEvent<HTMLInputElement>) => void {
	return (e: React.ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		updateFn(value);
	};
}

/**
 * formChangeWrapper wraps a setState function to take a react Input event function
 * @param {Map<string, fieldValue>} state - map containing form values in {K,V} pairs
 * @param {function} setState - function that will update the state
 * @param {string} fieldName - name of field to update
 * @returns {function} function suitable for a react input onChange={} prop
 */
export function formChangeWrapper(
	state: Map<string, any>,
	setState: React.Dispatch<React.SetStateAction<Map<string, any>>>,
	fieldName: string
): (e: React.ChangeEvent<HTMLInputElement>) => void {
	return e => {
		const { value, type, checked } = e.target;
		if (type === 'checkbox') {
			console.log('inside checkbox: ', state);
			// Type-safely create/get the set
			const set: Set<string> =
				state.get(fieldName) instanceof Set
					? (state.get(fieldName) as Set<string>)
					: new Set<string>();

			// Add or remove from the set
			if (checked) {
				set.add(value);
			} else {
				set.delete(value);
			}

			// Finally, update the set in the field
			setState(state.set(fieldName, set));
		} else {
			console.log('value', value);
			// Else field will be string, update directly
			setState(state.set(fieldName, state.get(fieldName) + value));
		}
	};
}

/**
 * checkValid is a factory method for a validation function
 * @param {T} input - the input on which to run the validation fn
 * @param {function} validFn - function to validate input
 * @param {function} updateFn - function to asynchronously update the state of the valid function
 * @return {function} an event handler function to run to update the valid status of the input
 */
export function checkValid<T>(
	input: T,
	validFn: (p: T) => boolean
	// updateFn: (p: boolean) => void
): () => void {
	return () => {};
	/* return () => updateFn(validFn(input)); */
}

// Copyright (c) 2019 Vanderbilt University
