import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';

export const TableButton = styled.button`
	color: ${STRINGS.DARK_TEXT_COLOR};
	background-color: white;
	border-color: ${STRINGS.ACCENT_COLOR};
	text-align: center;
	border-radius: 4px;
	width: 3rem;
	border-style: solid;
	border-width: 0.0625rem;
	margin-left: 1rem;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	&:focus {
		outline: none;
	}
	&:hover,
	&:active {
		box-shadow: 0rem 0rem 0.5rem 0rem #d0c9d6;
	}
`;

export default TableButton;
