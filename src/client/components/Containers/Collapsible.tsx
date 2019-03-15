import styled from 'styled-components';
import React, { FunctionComponent } from 'react';
import { FlexStartColumn, ContainerProps } from './FlexContainers';

export interface Props extends ContainerProps {
	backgroundOpacity?: string;
	borderRadius?: string;
	title: string;
	active: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const FloatingPopup = styled(FlexStartColumn)`
	transition: ease-in-out all 1s;
	background-color: rgba(247, 245, 249, ${(props: Props) => props.backgroundOpacity});
	border-radius: ${(props: Props) => props.borderRadius || '2rem'};
	padding: ${(props: Props) => props.padding || '0rem'};
	margin-bottom: ${(props: Props) => props.marginBottom || 0};
	height: ${(props: Props) => props.height || 'min-content'};
	/* height: min-content; */
	box-sizing: border-box;
`;

const CollapsibleHeader = styled.button`
	background-color: #555;
	color: white;
	cursor: pointer;
	padding: 18px;
	width: 100%;
	border: none;
	text-align: left;
	outline: none;
	font-size: 15px;
`;

const CollapsibleBody = styled.div`
	padding: 0 18px;
	background-color: #f1f1f1;
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.2s ease-out;

	&.active {
		max-height: 100%;
		overflow: auto;
	}
`;

export class Collapsible extends React.PureComponent<Props, {}> {
	public static onClick = (
		state: string,
		setState: React.Dispatch<React.SetStateAction<string>>
	): ((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) => {
		return e => {
			const { id } = e.target;

			if (id === state) {
				setState('');
			} else {
				setState(id);
			}
		};
	};

	public render() {
		const { title, children, active, ...rest } = this.props;
		console.log(title, active, title === active);
		return (
			<div>
				<CollapsibleHeader id={title} {...rest}>
					{title}
				</CollapsibleHeader>
				<CollapsibleBody className={title === active ? 'active' : ''}>{children}</CollapsibleBody>
			</div>
		);
	}
}

export default Collapsible;

// Copyright (c) 2019 Vanderbilt University
