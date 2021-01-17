import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { ThemeProvider } from 'styled-components';
import { Button as Component, ButtonProps as Props } from './Button';
import { ACCENT_COLOR, DARK_TEXT_COLOR, WARNING_COLOR } from '../../assets/strings.json';
import FloatingPopup from '../Containers/FloatingPopup';
import googleLogo from '../../assets/img/google_logo.svg';

export default {
	title: 'Components/Button',
	component: Component,
	argTypes: {
		onClick: { action: 'onClick' },
		filled: { control: 'boolean' },
		outline: { control: 'boolean' },
		large: { control: 'boolean' },
		small: { control: 'boolean' },
		default: { control: 'boolean' },
		long: { control: 'boolean' },
		alignStart: { control: 'boolean' },
		secondary: { control: 'boolean' },
		async: { control: 'boolean' },
		loading: { control: 'boolean' },
	},
	args: { children: 'Save' },
} as Meta;

const Button: Story<Props> = args => {
	return (
		<ThemeProvider
			theme={{
				borderRadius: '4px',
				colors: {
					main: ACCENT_COLOR,
					darkTextColor: DARK_TEXT_COLOR,
					lightTextColor: '#ffffff',
					secondary: '#ffffff',
					warning: WARNING_COLOR,
				},
			}}>
			{/* <GlobalStyle /> */}
			<Component {...args} />
		</ThemeProvider>
	);
};

export const DefaultButton: Story<Props> = args => <Button {...args} />;

export const FilledButton: Story<Props> = args => <Button {...args} />;
FilledButton.args = {
	filled: true,
};

export const OutlineButton: Story<Props> = args => <Button {...args} />;
OutlineButton.args = {
	outline: true,
};

export const LongButton: Story<Props> = args => <Button {...args} />;
LongButton.args = {
	long: true,
};

export const LargeButton: Story<Props> = args => <Button {...args} />;
LargeButton.args = {
	large: true,
};

export const SmallButton: Story<Props> = args => <Button {...args} />;
SmallButton.args = {
	small: true,
};

export const SecondaryOutlineButton: Story<Props> = args => <Button {...args} />;
SecondaryOutlineButton.args = {
	outline: true,
	secondary: true,
};

export const SecondaryFilledButton: Story<Props> = args => (
	<FloatingPopup>
		<Button {...args} />
	</FloatingPopup>
);
SecondaryFilledButton.args = {
	filled: true,
	secondary: true,
};

export const DisabledButton: Story<Props> = args => <Button {...args} />;
DisabledButton.args = {
	disabled: true,
};

export const AsyncButton: Story<Props> = args => <Button {...args} />;
AsyncButton.args = {
	async: true,
	children: 'Click Me!',
};

export const LargeStartAlignedSecondaryImgButton: Story<Props> = args => (
	<FloatingPopup>
		<Button {...args} />
	</FloatingPopup>
);
LargeStartAlignedSecondaryImgButton.args = {
	icon: googleLogo,
	children: 'Log In with Google',
	alignStart: true,
	secondary: true,
	large: true,
	filled: true,
};
