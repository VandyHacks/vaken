import React, { FunctionComponent } from 'react';
import { createSelectable } from 'react-selectable-fast';
import { TableRowProps } from 'react-virtualized';

interface Props extends TableRowProps {
	selectableRef: string;
	selected: boolean;
}

export const Row: FunctionComponent<Props> = (props: Props): JSX.Element => {
	const { className, columns, style, selectableRef, selected } = props;

	return (
		<div
			key={columns[2].props.title}
			className={`${className} ${selected && 'selected'}`}
			style={style}
			ref={selectableRef}>
			{columns}
		</div>
	);
};

export default createSelectable(Row);
