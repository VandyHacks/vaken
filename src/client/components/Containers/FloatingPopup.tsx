import styled from 'styled-components';
import { displayFlex } from './FlexContainers';

const FloatingPopup = styled.main`
	${displayFlex}
	justify-content: flex-start;
	transition: ease-in-out all 1s;
	background-color: rgba(247, 245, 249, 0.9);
	width: 30rem;
	height: 28rem;
	border-radius: 2rem;
	padding: 0rem;
`;

export default FloatingPopup;
