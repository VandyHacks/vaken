import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';

/**
 * Sits at the bottom right of the page. Add a label with child element text and a handler with onClick.
 */
export const FloatingButton = styled.button`
	background-color: ${STRINGS.ACCENT_COLOR};
	color: #ffffff;
	font-size: 1rem;
	position: fixed;
	width: 8rem;
	height: 3.75rem;
	bottom: 3.25rem;
	right: 3.75rem;
	border-radius: 4px;
	text-align: center;
	outline: none;
	border: none;
	&:focus {
		outline: none;
		border: none;
	}
	&:hover,
	&:active {
		box-shadow: 0rem 0rem 0.5rem 0rem #d0c9d6;
		outline: none;
		border: none;
	}
`;

export default FloatingButton;
