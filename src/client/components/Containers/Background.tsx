import styled from 'styled-components';
import { displayFlex } from './FlexContainers';

interface Props {
	img: string;
}

const Background = styled.div`
	${displayFlex}
	width: 100vw;
	height: 100vh;
	background: url(${({ img }: Props): string => img}) no-repeat;
	background-size: cover;
`;

export default Background;

// Copyright (c) 2019 Vanderbilt University
