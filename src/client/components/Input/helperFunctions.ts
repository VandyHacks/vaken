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
	return (e: React.ChangeEvent<HTMLInputElement>): void => {
		const { value } = e.target;
		updateFn(value);
	};
}

/**
 * formChangeWrapper wraps a setState function to take a react Input event function
 * this method is designed to be a fallback for string data types only
 * @param {function} setState - function that will update the state
 * @param {string} category - the category to update
 * @param {string} fieldName - name of field to update
 * @returns {function} function suitable for a react input onChange={} prop
 */
export function formChangeWrapper(
	setState: Update<any>,
	category: string,
	fieldName: string
): (e: React.ChangeEvent<HTMLInputElement>) => void {
	return (e): void => {
		const { value } = e.target;

		setState((draft): void => {
			if (!draft[category]) {
				draft[category] = {};
			}
			draft[category][fieldName] = value;
		});
	};
}

/**
 * checkValid is a factory method for a validation function
 * @param {T} input - the input on which to run the validation fn
 * @param {function} validFn - function to validate input
 * @return {function} an event handler function to run to update the valid status of the input
 */
export function checkValid<T>(input: T, validFn: (p: T) => boolean): () => void {
	return (): boolean => ((typeof input === 'string' && input.length) === 0 ? true : validFn(input));
}

/**
 * regexWrapper takes in a pattern string and returns the compiled
 * regex function that can be used for checkValid
 * @param {string} regex - pattern string for regex
 * @return {function} - fn to call to check if input matches regex
 */
export function regexWrapper(regex: string): (p: string) => boolean {
	const compiledRegex = new RegExp(regex);
	return (p: string): boolean => (p.length === 0 ? true : compiledRegex.test(p));
}
