import React, { Component } from 'react';
import produce from 'immer';
import emailIcon from '../../assets/img/email_icon.svg';
import lockIcon from '../../assets/img/lock_icon.svg';
import arrowIcon from '../../assets/img/right_arrow.svg';
import TextButton from '../../components/Buttons/TextButton';
import { LeftPaddedImg } from '../../components/Buttons/Buttons';
import { FlexStartContainer, FlexRow } from '../../components/Containers/FlexContainers';
import TextLink from '../../components/Text/TextLink';
import STRINGS from '../../assets/strings.json';
import LeftImgTextInput from '../../components/Input/LeftImgTextInput';

interface Props {}
interface State {
	email: string;
	emailValid: boolean; // Validation state for email field. Used for red underline and sending
	pass: string;
	passValid: boolean; // Validation state for password field. Used for red underline and sending
}

export default class PasswordLogin extends Component<Props, State> {
	public constructor(props: Props) {
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

	// public checkStatus = (response: object) => {
	//   if (response.status >= 200 && response.status < 300) {
	//     return response
	//   } else {
	//     var error = new Error(response.statusText)
	//     error.response = response
	//     throw error
	//   }
	// };

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
			const res = fetch('/api/login', {
				headers: {
					password: pass,
					username: email,
				},
				method: 'POST',
			})
				.then(() => alert('Successfully logged in!'))
				.catch(error => console.error(error));
		}
	};

	public render() {
		const { email, emailValid, pass, passValid } = this.state;
		return (
			<>
				<LeftImgTextInput
					img={emailIcon}
					imgAlt="Email icon"
					validationFn={this.checkEmailValidation}
					onChange={this.onChangeFn('email')}
					isValid={emailValid}
					value={email}
					placeholder="Email"
				/>
				<LeftImgTextInput
					img={lockIcon}
					imgAlt="Lock icon"
					validationFn={this.checkPassValidation}
					onChange={this.onChangeFn('pass')}
					isValid={passValid}
					value={pass}
					placeholder="Password"
				/>
				<FlexStartContainer>
					<TextButton
						color="white"
						fontSize="1.4em"
						background={STRINGS.ACCENT_COLOR}
						text="Login"
						glowColor="rgba(0, 0, 255, 0.67)"
					/>
					<TextLink to="/login">Forgot Username / Password?</TextLink>
					<FlexRow>
						<TextLink fontSize="1.4rem" color={STRINGS.ACCENT_COLOR} to="/login/create">
							New User? Create Account
						</TextLink>
						<LeftPaddedImg src={'/' + arrowIcon} alt="Right Arrow" />
					</FlexRow>
				</FlexStartContainer>
			</>
		);
	}
}
