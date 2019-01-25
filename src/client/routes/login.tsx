import React, { Component } from 'react';
import styled from 'styled-components';
import { Route, Switch, Link } from 'react-router-dom';
import produce from 'immer';
import STRINGS from '../assets/strings.json';
import bg from '../assets/img/login_bg.jpg';
import googleLogo from '../assets/img/google_logo.svg';
import githubLogo from '../assets/img/github_logo.svg';
import emailIcon from '../assets/img/email_icon.svg';
import lockIcon from '../assets/img/lock_icon.svg';
import arrowIcon from '../assets/img/right_arrow.svg';
import TextInput from '../components/TextInput';

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

const FlexRow = styled.div`
	${displayFlex}
	flex-flow: row nowrap;
`;

const StyledPopup = styled.main`
	${displayFlex}
	justify-content: flex-start;
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

	&:focus {
		outline: none;
	}
`;

const ButtonText = styled.div`
	${displayFlex}
	font-family: 'Roboto';
	font-size: ${(props: ButtonTextProps) => props.fontSize || '1.4rem'};
	color: ${(props: ButtonTextProps) => props.color || '#3f3356'};
`;

const LoginButton = styled(Button)`
	background: ${STRINGS.ACCENT_COLOR};
	margin-top: 1.6rem;
	margin-bottom: 0.5rem;
	color: white;

	&:hover,
	&:focus {
		box-shadow: 0px 0px 20px 0px rgba(0, 0, 255, 0.67);
	}
`;

const FlexStartContainer = styled.div`
	${displayFlex}
	justify-content: space-between;
	height: 10rem;
`;

const TextLink = styled(Link)`
	font-family: 'Roboto Condensed';
	font-size: 1rem;
	font-weight: 500;
	color: ${STRINGS.DARK_TEXT_COLOR};
	text-decoration: none;
`;

const PurpleBiggerTextLink = styled(TextLink)`
	font-size: 1.4rem;
	color: ${STRINGS.ACCENT_COLOR};
`;

const RightPaddedImg = styled.img`
	padding-right: 1rem;
`;

const LeftPaddedImg = styled.img`
	padding-left: 1rem;
`;

const ButtonOutline = styled(Button.withComponent('div'))`
	justify-content: flex-start;
	cursor: initial;

	img {
		padding-left: 2rem;
	}
`;

interface OAuthLoginProps {
	loginBtnFn: () => void;
}

const OAuthLogin = (props: OAuthLoginProps): JSX.Element => {
	const { loginBtnFn } = props;
	return (
		<>
			<Button>
				<FlexRow /* Edge case of centering icons */>
					<RightPaddedImg src={'/' + googleLogo} alt="Google logo" />
				</FlexRow>
				<ButtonText>Sign in with Google</ButtonText>
			</Button>
			<Button>
				<FlexRow /* Edge case of centering icons */>
					<RightPaddedImg src={'/' + githubLogo} alt="GitHub logo" />
				</FlexRow>
				<ButtonText>Sign in with GitHub</ButtonText>
			</Button>
			<Link style={{ textDecoration: 'none' }} to="/login/password">
				{/* Link tag enables use of back button in browser */}
				<LoginButton>
					<ButtonText color="white" fontSize="1.6em">
						Sign in with email
					</ButtonText>
				</LoginButton>
			</Link>
		</>
	);
};

interface PWLoginProps {}
interface PWLoginState {
	email: string;
	emailValid: boolean; // Validation state for email field. Used for red underline and sending
	pass: string;
	passValid: boolean; // Validation state for password field. Used for red underline and sending
}

class PasswordLogin extends Component<PWLoginProps, PWLoginState> {
	public constructor(props: PWLoginProps) {
		super(props);
		this.state = {
			email: '',
			emailValid: true,
			pass: '',
			passValid: true,
		};
	}

	public onChangeFn = (field: string) => {
		// This function takes in the field to change in state. It is not type-safe,
		// but writeability is a lot cleaner for multiple fields
		return (e: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = e.target;
			this.setState(
				produce((curState: any) => {
					// This is where the state is changed. produce() is from immer
					curState[field] = value;
				})
			);
		};
	};

	public emailValidation = (e: string): boolean => {
		// Validate email using regex
		return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e);
	};

	public passValidation = (p: string): boolean => {
		// Validate password of length > 8, number, letter, and symbol using regex
		return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(p);
	};

	// checkEmailValidation factored out of render for performance reasons
	// see https://medium.freecodecamp.org/why-arrow-functions-and-bind-in-reacts-render-are-problematic-f1c08b060e36
	public checkEmailValidation = (): void => {
		const { email } = this.state;
		const valid = this.emailValidation(email);
		// Keep as much work out of the setState call as possible
		this.setState({ emailValid: valid });
	};

	// checkPassValidation factored out of render for performance reasons
	// see https://medium.freecodecamp.org/why-arrow-functions-and-bind-in-reacts-render-are-problematic-f1c08b060e36
	public checkPassValidation = (): void => {
		const { pass } = this.state;
		const valid = this.passValidation(pass);
		// Keep as much work out of the setState call as possible
		this.setState({ passValid: valid });
	};

	public validateAndSubmit = () => {
		const { email, pass } = this.state;
		const emailValid = this.emailValidation(email);
		const passValid = this.passValidation(pass);
		// Do one more check for valid fields (to handle edge case where
		// constructor sets valids to true)
		this.setState(
			produce(curState => {
				// Keep as much work out of the setState call as possible.
				// That's why we set the consts above.
				curState.emailValid = emailValid;
				curState.passValid = passValid;
			})
		);

		if (emailValid && passValid) {
			// TODO: Actually log in instead of console.log
			const res = fetch('/login', {
				method: 'POST',
				body: JSON.stringify({
					user: email,
					pass: pass,
				}),
			}).then(() => alert('Successfully logged in!'));
		}
	};

	public render() {
		const { email, emailValid, pass, passValid } = this.state;
		return (
			<>
				<ButtonOutline>
					<RightPaddedImg src={'/' + emailIcon} alt="Google logo" />
					<TextInput
						placeholder="Email"
						type="text"
						value={email}
						valid={emailValid}
						onChange={this.onChangeFn('email')}
						onBlur={this.checkEmailValidation}
					/>
				</ButtonOutline>
				<ButtonOutline>
					<RightPaddedImg src={'/' + lockIcon} alt="GitHub logo" />
					<TextInput
						placeholder="Password"
						type="password"
						value={pass}
						valid={passValid}
						onChange={this.onChangeFn('pass')}
						onBlur={this.checkPassValidation}
					/>
				</ButtonOutline>
				<FlexStartContainer>
					<LoginButton onClick={this.validateAndSubmit}>
						<ButtonText color="white" fontSize="1.6em">
							Login
						</ButtonText>
					</LoginButton>
					<TextLink to="/login">Forgot Username / Password?</TextLink>
					<FlexRow>
						<PurpleBiggerTextLink to="/login/create">New User? Create Account</PurpleBiggerTextLink>
						<LeftPaddedImg src={'/' + arrowIcon} alt="Right Arrow" />
					</FlexRow>
				</FlexStartContainer>
			</>
		);
	}
}

const LoginPage = (): JSX.Element => {
	return (
		<>
			<Background>
				<StyledPopup>
					<Title>{STRINGS.FULL_NAME}</Title>
					<Switch>
						<Route path="/login/password" component={PasswordLogin} />
						<Route component={OAuthLogin} />
					</Switch>
				</StyledPopup>
			</Background>
		</>
	);
};

export default LoginPage;
export { Button, ButtonText, Title, Background };
