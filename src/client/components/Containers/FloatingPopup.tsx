import styled from 'styled-components';
import { displayFlex } from './FlexContainers';

interface Props {
	height?: string;
	width?: string;
	opacity: number;
	gridArea?: string;
	padding?: string;
}

const FloatingPopup = styled.main`
	${displayFlex}
	${(props: Props) =>
		props.gridArea ? 'grid-area: ' + props.gridArea + ';' : null}
	justify-content: flex-start;
	transition: ease-in-out all 1s;
	background-color: rgba(247, 245, 249, ${(props: Props) => props.opacity});
	${(props: Props) => (props.height ? 'height: ' + props.height + ';' : null)}
	${(props: Props) => (props.width ? 'width: ' + props.width + ';' : null)}
	border-radius: 2rem;
	padding: ${(props: Props) => props.padding || '0rem'};
`;

export default FloatingPopup;
