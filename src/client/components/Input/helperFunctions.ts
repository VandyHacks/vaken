/**
 * onChangeWrapper wraps a setState function to take a react Input event function
 * @param {function} updateFn - function that will update the state
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
 * checkValid is a factory method for a validation function
 * @param {T} input - the input on which to run the validation fn
 * @param {function} validFn - function to validate input
 * @param {function} updateFn - function to asynchronously update the state of the valid function
 * @return {function} an event handler function to run to update the valid status of the input
 */
export function checkValid<T>(
	input: T,
	validFn: (p: T) => boolean,
	updateFn: (p: boolean) => void
): () => void {
	return () => updateFn(validFn(input));
}
