import styled from 'styled-components';
import React from 'react';
import { Button, LeftButtonText } from './Buttons';

interface Props {
	color?: string;
	text: string;
	fontSize?: string;
	active?: boolean;
}

interface StyleProps {
	color?: string;
	active?: boolean;
}

export const StyledNavBtn = styled(Button)`
	background: ${(props: StyleProps) => (props.active ? 'RGBA(255, 255, 255, 0.2)' : 'none')};
	color: ${(props: StyleProps) => props.color || 'black'};
	font-weight: ${(props: StyleProps) => (props.active ? 'bold' : 'regular')};
	border-radius: 0;
	justify-content: flex-start;
	width: 100%;
	padding-left: 2rem;
	margin: 0;
	height: 4rem;

	&:hover,
	&:focus {
		background: rgba(255, 255, 255, 0.4);
		box-shadow: none;
	}
`;

const NavButton = (props: Props): JSX.Element => {
	const { text } = props;

	return (
		<StyledNavBtn {...props}>
			<LeftButtonText {...props}>{text}</LeftButtonText>
		</StyledNavBtn>
	);
};

export default NavButton;
