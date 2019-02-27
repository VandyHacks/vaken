import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
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
				{options.map(item => {
					return <option key={item} value={item} />;
				})}
				{options.includes(value) ? null : <option value={value} />}
			</datalist>
		</>
	);
};

export default AutoComplete;
