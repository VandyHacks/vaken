import styled from 'styled-components';
import React, { useRef, useState, useEffect } from 'react';
import ResizeObserver from 'resize-observer-polyfill';
import { FlexStartColumn, ContainerProps } from './FlexContainers';

export interface Props extends ContainerProps {
	backgroundOpacity?: string;
	borderRadius?: string;
	title: string;
	active: string;
	onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export const useMeasure = (): any => {
	const ref = useRef<any>();
	const [bounds, set] = useState({ height: 0, left: 0, top: 0, width: 0 });
	const [ro] = useState(() => new ResizeObserver(([entry]: any) => set(entry.contentRect)));
	useEffect(() => (ro.observe(ref.current), ro.disconnect), [ro]);
	return [{ ref }, bounds];
};

export const FloatingPopup = styled(FlexStartColumn)`
	transition: ease-in-out all 1s;
	background-color: rgba(
		247,
		245,
		249,
		${({ backgroundOpacity = '1' }: Props): string => backgroundOpacity}
	);
	border-radius: ${({ borderRadius = '2rem' }: Props): string => borderRadius};
	padding: ${({ padding = '0' }: Props): string => padding};
	margin-bottom: ${({ marginBottom = '0' }: Props): string => marginBottom};
	height: ${({ height = 'min-content' }: Props): string => height};
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
	padding: 1.5rem;
	background-color: #f1f1f1;
	max-height: 0;
	overflow: hidden;
	transition: max-height 0.2s ease-out;
	display: grid;
	grid-auto-flow: row;
	grid-gap: 1.4rem;

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
		return (e): void => {
			const { id } = e.target as HTMLButtonElement;

			if (id === state) {
				setState('');
			} else {
				setState(id);
			}
		};
	};

	public render(): JSX.Element {
		const { title, children, active, ...rest } = this.props;

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
