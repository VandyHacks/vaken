import React from 'react';
import renderer from 'react-test-renderer';
import ApolloClient from 'apollo-boost';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloProvider } from 'react-apollo';
import { Profile } from './Profile';

const client = new ApolloClient({ uri: '/graphql' });

describe('Test Profile', () => {
	it('renders correctly', async () => {
		const component = renderer
			.create(
				<ApolloProvider client={client}>
					<ApolloHooksProvider client={client}>
						<Profile />
					</ApolloHooksProvider>
				</ApolloProvider>
			)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
