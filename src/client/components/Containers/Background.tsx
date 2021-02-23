import styled from 'styled-components';
import { displayFlex } from './FlexContainers';

export interface Props {
	/** Image url to be displayed covering the background of the page */
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
