import produce from 'immer';
import { Update } from 'use-immer';
import { fieldValue } from '../../routes/application/Application';

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
 * @param {function} useImmer - function that will update the state
 * @param {string} fieldName - name of field to update
 * @returns {function} function suitable for a react input onChange={} prop
 */
export function formChangeWrapper(
	useImmer: Update<Map<string, fieldValue>>,
	fieldName: string
): (e: React.ChangeEvent<HTMLInputElement>) => void {
	return e => {
		const { value, type, checked } = e.target;
		useImmer((draft: Map<string, fieldValue>) => {
			if (type === 'checkbox') {
				console.log('inside checkbox: ', draft);
				// Type-safely create/get the set
				const set: Set<string> =
					draft.get(fieldName) instanceof Set
						? (draft.get(fieldName) as Set<string>)
						: new Set<string>();

				// Add or remove from the set
				if (checked) {
					set.add(value);
				} else {
					set.delete(value);
				}

				// Finally, update the set in the field
				draft.set(fieldName, set);
			} else {
				// Else field will be string, update directly
				draft.set(fieldName, value);
			}
		});
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
