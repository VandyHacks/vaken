import React, { FunctionComponent } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import STRINGS from '../../assets/strings.json';
import SadFace from '../../assets/img/sad_face.svg';
import TextButton from '../Buttons/TextButton';

const Rectangle = styled.div`
	border: 0.1rem solid ${STRINGS.WARNING_COLOR};
	border-radius: 8px;
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
	const { children } = props;
	return (
		<Rectangle>
			<img src={SadFace} alt="Sad face" />
			{children}
		</Rectangle>
	);
};

interface GraphQLErrorMessage {
	text?: string;
}

export const GraphQLErrorMessage: FunctionComponent<GraphQLErrorMessage> = (
	props: GraphQLErrorMessage
): JSX.Element => {
	const { text } = props;
	return (
		<ErrorMessage>
			<>
				<StyledP>{text}</StyledP>
				<Link style={{ textDecoration: 'none' }} to="/dashboard">
					<TextButton background={STRINGS.WARNING_COLOR} color="white">
						<p>Return to Dashboard</p>
					</TextButton>
				</Link>
			</>
		</ErrorMessage>
	);
};
