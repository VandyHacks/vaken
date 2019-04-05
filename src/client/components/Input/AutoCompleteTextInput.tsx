import React, { FunctionComponent } from 'react';
import Input, { Props as InputProps } from './TextInput';

interface Props extends InputProps {
	options?: string[];
}

const AutoComplete: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const { options = ['default'], value } = props;
	const listID = options[0] || 'list';

	return (
		<>
			<Input type="text" list={listID} {...props} />
			<datalist id={listID}>
				{options.map(
					(item): JSX.Element => {
						return <option key={item} value={item} />;
					}
				)}
				{options.includes(value as string) ? null : <option value={value as string} />}
				{/* // FIXME */}
			</datalist>
		</>
	);
};

export default AutoComplete;
