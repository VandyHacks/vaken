import styled from 'styled-components';
import React from 'react';
import { Button, LeftButtonText } from './Buttons';

interface Props {
	active?: boolean;
	color?: string;
	fontSize?: string;
	text: string;
}

interface StyleProps {
	active?: boolean;
	color?: string;
}

export const StyledNavBtn = styled(Button)`
	background: ${({ active }: StyleProps): string => (active ? 'RGBA(255, 255, 255, 0.2)' : 'none')};
	color: ${({ color = 'black' }: StyleProps): string => color};
	font-weight: ${({ active }: StyleProps): string => (active ? 'bold' : 'regular')};
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
