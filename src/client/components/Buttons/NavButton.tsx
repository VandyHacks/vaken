import styled from 'styled-components';
import React, { HTMLAttributes, FC } from 'react';
import type CSS from 'csstype';
import { Button, LeftButtonText } from './Buttons';

export interface StyleProps extends Pick<CSS.Properties, 'color'> {
	active?: boolean;
}

export const StyledNavBtn = styled(Button)`
	background: ${({ active }: StyleProps): string => (active ? 'RGBA(255, 255, 255, 0.2)' : 'none')};
	color: ${({ color }: StyleProps): string => color || 'black'};
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

const NavButton: FC<HTMLAttributes<HTMLElement>> = ({
	children,
	...props
}: HTMLAttributes<HTMLElement>) => (
	<StyledNavBtn {...props}>
		<LeftButtonText {...props}>{children}</LeftButtonText>
	</StyledNavBtn>
);

export default NavButton;
