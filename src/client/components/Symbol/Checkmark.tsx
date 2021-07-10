import React, { FC } from 'react';
import styled from 'styled-components';
import type CSS from 'csstype';
import { ACCENT_COLOR } from '../../assets/strings';

export interface Props extends Pick<CSS.Properties, 'color' | 'height' | 'width'> {
	value: boolean;
}

const StyledSVG = styled('svg')`
	vertical-align: middle;
`;

export const Checkmark: FC<Props> = ({ width, height, value, color }: Props) => (
	<StyledSVG
		width={width || '1.333em'}
		height={height || '1.333em'}
		viewBox="0 0 16 16"
		fill="none"
		xmlns="http://www.w3.org/2000/svg">
		{value ? (
			<>
				<path
					d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z"
					fill={color || ACCENT_COLOR}
				/>
				<path
					d="M10.329 5.83928C10.5587 5.60956 10.9312 5.60956 11.1609 5.83928C11.3906 6.069 11.3906 6.44145 11.1609 6.67117L7.63147 10.2006C7.40175 10.4303 7.0293 10.4303 6.79958 10.2006L4.83879 8.2398C4.60907 8.01008 4.60907 7.63763 4.83879 7.40791C5.06851 7.17819 5.44096 7.17819 5.67068 7.40791L7.21552 8.95275L10.329 5.83928Z"
					fill="white"
				/>
			</>
		) : (
			<path
				d="M15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8Z"
				fill="white"
				stroke={color || ACCENT_COLOR}
			/>
		)}
	</StyledSVG>
);

export default Checkmark;
