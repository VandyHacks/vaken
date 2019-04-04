import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import STRINGS from '../../assets/strings.json';
// @ts-ignore
import SadFace from '../../assets/img/sad_face.svg?inline';
import TextButton from '../Buttons/TextButton';

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

const StyledP = styled.p`
	white-space: pre-line;
`;

interface ErrorMessageProps {
	children?: JSX.Element;
}

export const ErrorMessage: FunctionComponent<ErrorMessageProps> = (
	props: ErrorMessageProps
): JSX.Element => {
	return (
		<Rectangle>
			<SadFace />
			{props.children}
		</Rectangle>
	);
};

interface GraphQLErrorMessage {
	text?: string;
}

export const GraphQLErrorMessage: FunctionComponent<GraphQLErrorMessage> = (
	props: GraphQLErrorMessage
): JSX.Element => {
	return (
		<ErrorMessage>
			<>
				<StyledP>{props.text}</StyledP>
				<Link style={{ textDecoration: 'none' }} to="/dashboard">
					<TextButton text="Return to Dashboard" background={STRINGS.WARNING_COLOR} color="white" />
				</Link>
			</>
		</ErrorMessage>
	);
};

{
	/* export default ErrorMessage; */
}
// Copyright (c) 2019 Vanderbilt University
