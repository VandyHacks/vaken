import styled from 'styled-components';
import searchIcon from '../../assets/img/search_icon.svg';
import STRINGS from '../../assets/strings.json';

interface Props {
	error?: boolean;
	minWidth?: string;
	width?: string;
	hasIcon?: boolean;
}

const SearchBox = styled('input')`
	min-width: ${({ minWidth = '30rem' }: Props): string => minWidth};
	${({ width = '' }: Props): string => width};
	margin: 0.25rem 1rem 0.25rem 0rem;
	padding: 0.75rem;
	border: 0.0625rem solid ${({ error }: Props): string => (error ? '#FF647C' : '#ecebed')};
	box-shadow: 0rem 0.5rem 4rem rgba(0, 0, 0, 0.07);
	border-radius: 0.375rem;
	font-size: 1rem;
	box-sizing: border-box;
	${({ hasIcon }: Props): string => (hasIcon ? 'padding-left: 2rem;' : '')};
	${({ hasIcon }: Props): string =>
		hasIcon ? `background: #ffffff url(${searchIcon}) 0.25rem 50% no-repeat;` : ''};
	:focus,
	:active {
		outline: none;
		border: 0.0625rem solid
			${({ error }: Props): string => (error ? '#FF647C' : STRINGS.ACCENT_COLOR)};
	}
`;

export default SearchBox;
