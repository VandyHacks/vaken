import styled from 'styled-components';
import searchIcon from '../../assets/img/search_icon.svg';
import STRINGS from '../../assets/strings.json';

interface Props {
	error?: boolean;
	flex?: boolean;
	hasIcon?: boolean;
	minWidth?: string;
	width?: string;
}

const SearchBox = styled('input')`
	${(props: Props) => props.flex && 'flex-grow: 1;'};
	min-width: ${(props: Props) => (props.minWidth ? props.minWidth : '30rem')};
	${(props: Props) => (props.width ? props.width : null)};
	margin: 0.25rem 1rem 0.25rem 0rem;
	padding: 0.75rem;
	border: 0.0625rem solid ${(props: Props) => (props.error ? '#FF647C' : '#ecebed')};
	box-shadow: 0rem 0.5rem 4rem rgba(0, 0, 0, 0.07);
	border-radius: 0.375rem;
	font-size: 1rem;
	box-sizing: border-box;
	${(props: Props) => props.hasIcon && 'padding-left: 2rem;'};
	${(props: Props) =>
		props.hasIcon && `background: #ffffff url(${searchIcon}) 0.25rem 50% no-repeat;`};
	:focus,
	:active {
		outline: none;
		border: 0.0625rem solid ${(props: Props) => (props.error ? '#FF647C' : STRINGS.ACCENT_COLOR)};
	}
`;

export default SearchBox;
