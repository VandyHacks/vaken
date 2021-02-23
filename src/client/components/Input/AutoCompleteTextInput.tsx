import React, { FC, useState, useEffect } from 'react';
import { Input, InputProps } from './TextInput';

export interface Props extends InputProps {
	/**
	 * An array or promise to an array of strings to be autocompleted on typing.
	 * This component allows custom inputs in addition to the provided options.
	 */
	options?: Promise<{ data: string[] }> | string[];
}

const AutoComplete: FC<Props> = props => {
	const { options = ['default'], value } = props;
	const [awaitedOptions, setAwaitedOptions] = useState(['Loading...']);

	// Async support for options
	useEffect(() => {
		if (options instanceof Promise) {
			options.then(module => setAwaitedOptions(module.data)).catch(() => setAwaitedOptions([]));
		} else {
			setAwaitedOptions(options);
		}
	}, [options]);

	const [listID = 'list'] = awaitedOptions;
	return (
		<>
			<Input type="text" list={listID} {...props} />
			<datalist id={listID}>
				{awaitedOptions.map(
					(item): JSX.Element => {
						return <option aria-label={item} key={item} value={item} />;
					}
				)}
				{awaitedOptions.includes(value) ? null : <option aria-label={value} value={value} />}
			</datalist>
		</>
	);
};

export default AutoComplete;
