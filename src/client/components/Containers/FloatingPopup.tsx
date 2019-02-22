import styled from 'styled-components';
import { FlexStartColumn, ContainerProps as Props } from './FlexContainers';

const FloatingPopup = styled(FlexStartColumn)`
	transition: ease-in-out all 1s;
	background-color: rgba(247, 245, 249, ${(props: Props) => props.backgroundOpacity});
	border-radius: 2rem;
	padding: ${(props: Props) => props.padding || '0rem'};
	margin-bottom: ${(props: Props) => props.marginBottom || 0};
	/* height: min-content; */
	box-sizing: border-box;
`;

export default FloatingPopup;

// Copyright (c) 2019 Vanderbilt University
