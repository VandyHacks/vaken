import React, { FunctionComponent } from 'react';
// TODO(alan): fix
// @ts-ignore
import { createSelectable } from 'react-selectable-fast';
import { TableRowProps } from 'react-virtualized';

interface Props extends TableRowProps {
	selectableRef: any;
	selected: boolean;
	selecting: boolean;
}

export const Row: FunctionComponent<Props> = (props: Props): JSX.Element => {
	return (
		<div
			key={props.columns[2].props.title}
			className={props.className + ` ${props.selected && 'selected'}`}
			style={props.style}
			ref={props.selectableRef}>
			{props.columns}
		</div>
	);
};

export default createSelectable(Row);

// Copyright (c) 2019 Vanderbilt University
