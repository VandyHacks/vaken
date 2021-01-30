import React from 'react';
import { Meta, Story } from '@storybook/react'; // eslint-disable-line import/no-extraneous-dependencies
import { ThemeProvider } from 'styled-components';
import Component from './SponsorDash';
import { AuthContext } from '../../contexts/AuthContext';
import { UserType } from '../../generated/graphql';
import { theme } from '../../app';

export default {
	title: 'Routes/Dashboard/Sponsor Dash',
	component: Component,
} as Meta;

export const SponsorDash: Story<Record<string, unknown>> = args => (
	<ThemeProvider theme={theme}>
		<AuthContext.Provider
			value={{
				email: 'email@email.com',
				firstName: 'firstName',
				lastName: 'lastName',
				id: 'id',
				userType: UserType.Sponsor,
				__typename: 'Sponsor',
			}}>
			<Component {...args} />
		</AuthContext.Provider>
	</ThemeProvider>
);
