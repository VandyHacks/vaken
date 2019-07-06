import React, { FunctionComponent } from 'react';
import { Input, InputProps } from './TextInput';

interface Props extends InputProps {
	options?: string[];
}

const AutoComplete: FunctionComponent<Props> = (props: Props) => {
	const { options = ['default'], value } = props;
	const [listID = 'list'] = options;

	return (
		<>
			<Input type="text" list={listID} {...props} />
			<datalist id={listID}>
				{options.map(
					(item): JSX.Element => {
						return <option key={item} value={item} />;
					}
				)}
				{options.includes(value) ? null : <option value={value} />}
			</datalist>
		</>
	);
};

export default AutoComplete;
