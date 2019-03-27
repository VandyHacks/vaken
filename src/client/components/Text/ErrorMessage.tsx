import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';
// @ts-ignore
import SadFace from '../../assets/img/sad_face.svg?inline';

const Rectangle = styled.div`
	border: 0.1rem solid ${STRINGS.WARNING_COLOR};
	border-radius: 1rem;
	display: inline-block;
	text-align: center;
	color: ${STRINGS.WARNING_COLOR};
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	font-size: 1.5rem;
	display: inline-block;
	padding: 1rem;
`;

interface Props {
	children?: JSX.Element;
}

export const ErrorMessage: FunctionComponent<Props> = (props: Props): JSX.Element => {
	return (
		<Rectangle>
			<SadFace />
			{props.children}
		</Rectangle>
	);
};

export default ErrorMessage;
