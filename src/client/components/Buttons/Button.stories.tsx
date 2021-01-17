import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { ThemeProvider } from 'styled-components';
import { MemoryRouter } from 'react-router-dom';
import { Button as Component, ButtonProps as Props } from './Button';
import FloatingPopup from '../Containers/FloatingPopup';
import googleLogo from '../../assets/img/google_logo.svg';
import { theme } from '../../app';

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
		<MemoryRouter>
			<ThemeProvider theme={theme}>
				<Component {...args} />
			</ThemeProvider>
		</MemoryRouter>
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

export const InternalLinkButton: Story<Props> = args => <Button {...args} />;
InternalLinkButton.args = {
	linkTo: '/manage/hackers',
	children: 'Go to different page',
};

export const LinkButton: Story<Props> = args => <Button {...args} />;
LinkButton.args = {
	linkTo: 'https://vandyhacks.org',
	children: 'Navigate away',
};

export const LargeLongSecondaryImgButton: Story<Props> = args => (
	<FloatingPopup>
		<Button {...args} />
	</FloatingPopup>
);
LargeLongSecondaryImgButton.args = {
	icon: googleLogo,
	children: 'Log In with Google',
	secondary: true,
	large: true,
	filled: true,
	long: true,
};
