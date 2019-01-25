import React from 'react';
import styled from 'styled-components';
import { Route, Link, Switch } from 'react-router-dom';
import STRINGS from '../assets/strings.json';
import bg from '../assets/img/login_bg.jpg';
import googleLogo from '../assets/img/google_logo.svg';
import githubLogo from '../assets/img/github_logo.svg';
import '../components/Textbox';

interface ButtonTextProps {
	fontSize?: string;
	color?: string;
}

interface LoginPageState {
	passwordLogin: boolean;
}

const displayFlex = `
	display: flex;
	flex-flow: column nowrap;
	align-items: center;
	justify-content: center;
`;

const StyledPopup = styled.main`
	${displayFlex}
	transition: ease-in-out all 1s;
	background-color: rgba(247, 245, 249, 0.9);
	width: 30rem;
	height: 28rem;
	border-radius: 2rem;
	padding: 0rem;
`;

const Background = styled.div`
	${displayFlex}
	width: 100vw;
	height: 100vh;
	background: url(${'/' + bg}) no-repeat;
	background-size: cover;
`;

const Title = styled.h1`
	font-family: 'Roboto', sans-serif;
	font-weight: 500;
	font-size: 2.5rem;
	color: ${STRINGS.DARK_TEXT_COLOR};
	margin: 1.5rem;
`;

const Button = styled.button`
	${displayFlex}
	flex-flow: row;
	font-weight: 400;
	width: 23.33rem;
	height: 3.2rem;
	margin-bottom: 1.6rem;
	background: white;
	border-radius: 1rem;
	cursor: pointer;
	border: none;

	&:hover {
		box-shadow: 0px 0px 30px 0px rgba(255, 255, 255, 1);
	}
`;

const ButtonText = styled.div`
	${displayFlex}
	font-family: 'Roboto';
	font-size: ${(props: ButtonTextProps) => props.fontSize || '1.4rem'};
	color: ${(props: ButtonTextProps) => props.color || '#3f3356'};
`;

const LoginButton = styled(Button)`
	background: #6979f8;
	margin-top: 1.6rem;

	&:hover {
		box-shadow: 0px 0px 20px 0px rgba(0, 0, 255, 0.67);
	}

	ButtonText {
		text-decoration: none;
		color: white;
		font-size: 1.6rem;
	}
`;

const PaddedImg = styled.img`
	padding-right: 1rem;
`;

const ButtonOutline = styled(Button.withComponent('div'))`
	padding-left: 2rem;
	justify-content: flex-start;
	cursor: text;
`;



interface OAuthLoginProps {
	loginBtnFn: () => void;
}

const OAuthLogin = (props: OAuthLoginProps): JSX.Element => {
	const { loginBtnFn } = props;
	return (
		<>
			<Button>
				<PaddedImg src={'/' + googleLogo} alt="Google logo" />
				<ButtonText>Sign in with Google</ButtonText>
			</Button>
			<Button>
				<PaddedImg src={'/' + githubLogo} alt="GitHub logo" />
				<ButtonText>Sign in with GitHub</ButtonText>
			</Button>
			<LoginButton onClick={loginBtnFn}>
				<ButtonText color="white" fontSize="1.6em">
					Sign in with email
				</ButtonText>
			</LoginButton>
		</>
	);
};

const PasswordLogin = (): JSX.Element => {
	return (
		<>
			<ButtonOutline>
				<PaddedImg src={'/' + googleLogo} alt="Google logo" />
				<TextInput placeholder="Email" type="text" />
			</ButtonOutline>
			<ButtonOutline>
				<PaddedImg src={'/' + githubLogo} alt="GitHub logo" />
				<ButtonText>Sign in with GitHub</ButtonText>
			</ButtonOutline>
			<LoginButton>
				<ButtonText color="white" fontSize="1.6em">
					Login
				</ButtonText>
			</LoginButton>
		</>
	);
};

interface LoginPageProps {}

class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
	public constructor(props: LoginPageProps) {
		super(props);
		this.state = {
			passwordLogin: false,
		};
	}

	public togglePwLogin = () => {
		this.setState(curState => {
			const { passwordLogin } = curState;
			return {
				passwordLogin: !passwordLogin,
			};
		});
	};

	public render() {
		const { passwordLogin } = this.state;
		return (
			<>
				<Background>
					<StyledPopup>
						<Title>{STRINGS.FULL_NAME}</Title>
						{passwordLogin ? <PasswordLogin /> : <OAuthLogin loginBtnFn={this.togglePwLogin} />}
					</StyledPopup>
				</Background>
			</>
		);
	}
}

export default LoginPage;
export { Button, ButtonText, Title, Background };
