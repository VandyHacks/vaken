import React from 'react';
import styled from 'styled-components';
import STRINGS from '../assets/strings.json';
import bg from '../assets/img/login_bg.jpg';
import googleLogo from '../assets/img/google_logo.svg';
import githubLogo from '../assets/img/github_logo.svg';

interface ButtonTextProps {
	fontSize?: string;
	color?: string;
}

const StyledPopup = styled.main`
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: flex-start;
	background-color: rgba(247, 245, 249, 0.9);
	width: 30em;
	height: 28em;
	border-radius: 2em;
	padding: 0em;
`;

const Background = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100vw;
	height: 100vh;
	background: url(${bg}) no-repeat;
	background-size: cover;
`;

const Title = styled.h1`
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	font-size: 2.5em;
	color: #3f3356;
`;

const Button = styled.button`
	width: 23.33em;
	height: 3.2em;
	padding: 0;
	margin: 0;
	margin-bottom: 1.6em;
	background: white;
	border: none;
	border-radius: 1em;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-flow: row nowrap;
	font-family: 'Roboto';
	cursor: pointer;
`;

const ButtonText = styled.div`
	font-size: ${(props: ButtonTextProps) => props.fontSize || '1.4em'};
	color: ${(props: ButtonTextProps) => props.color || '#3f3356'};
	display: flex;
	width: max-content;
	margin: 0;
	padding: 0;
`;

const LoginButton = styled(Button)`
	background: #6979f8;
	margin-top: 1.6em;

	ButtonText {
		color: white;
		font-size: 1.6em;
	}
`;

const PaddedImg = styled.img`
	padding-right: 1em;
`;

const LoginPage = (): JSX.Element => {
	return (
		<>
			<Background>
				<StyledPopup>
					<Title>{STRINGS.FULL_NAME}</Title>
					<Button>
						<PaddedImg src={googleLogo} alt="Google logo" />
						<ButtonText>Sign in with Google</ButtonText>
					</Button>
					<Button>
						<PaddedImg src={githubLogo} alt="GitHub logo" />
						<ButtonText>Sign in with GitHub</ButtonText>
					</Button>
					<LoginButton>
						<ButtonText color="white" fontSize="1.6em">
							Sign in with email
						</ButtonText>
					</LoginButton>
				</StyledPopup>
			</Background>
		</>
	);
};

export default LoginPage;
