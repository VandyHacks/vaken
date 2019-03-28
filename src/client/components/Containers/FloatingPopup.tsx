import styled from 'styled-components';
import { FlexStartColumn, ContainerProps } from './FlexContainers';

const hexToRGB = (hex: string) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `${r}, ${g}, ${b}`;
}

export interface Props extends ContainerProps {
	backgroundColor?: string;
	backgroundOpacity?: string;
	borderRadius?: string;
}

const FloatingPopup = styled(FlexStartColumn)`
	transition: ease-in-out all 1s;
	background-color: rgba(${(props: Props) => props.backgroundColor ? hexToRGB(props.backgroundColor) : '247, 245, 249'}, ${(props: Props) => props.backgroundOpacity || '1'});
	border-radius: ${(props: Props) => props.borderRadius || '2rem'};
	padding: ${(props: Props) => props.padding || '1.5rem'};
	margin-bottom: ${(props: Props) => props.marginBottom || 0};
	height: ${(props: Props) => props.height || 'min-content'};
	/* height: min-content; */
	box-sizing: border-box;
`;

export default FloatingPopup;

// Copyright (c) 2019 Vanderbilt University
