/**
 * Higher-order function creating a type guard function for an enum. When
 * used in the form `Array.filter(valueOf(myEnum))`, will filter every member
 * of `Array` to be valid values of `myEnum`
 * @param enumObject Enum object containing values to compare the input against.
 */
export function valueOf<T extends Record<string, string>>(enumObject: T) {
	return (input: string): input is T[keyof T] => Object.values(enumObject).includes(input);
}

/**
 * Filter predicate for non-null values.
 * @param value Possibly nullish value
 * @returns True if `value` is non-nullish
 */
export function notEmpty<T>(value: T | null | undefined): value is T {
	return value !== null && value !== undefined;
}

/**
 * When passed a value, asserts that all possible cases have been handled.
 *
 * Use like so:
 *
 * ```
 * if (typeof param === 'string') {
 *   // handle param as string
 * } else if (typeof param === 'number') {
 *   // handle param as number
 * } else {
 *   // TypeScript will ensure the above cases are kept up-to-date if the type of param changes
 *   // by throwing an error if any case isn't handled
 *   checkExhaustive(param)
 * }
 * ```
 */
export function checkExhaustive(param: never): never {
	throw new Error(`Missed switch case: ${param}`);
}
