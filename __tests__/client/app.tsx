import React from 'react';
import renderer from 'react-test-renderer';
import ApolloClient from 'apollo-boost';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloProvider } from 'react-apollo';
import Vaken from '../../src/client/app';

const client = new ApolloClient({ uri: '/graphql' });

describe('Test Vaken', () => {
	it('Vaken main app renders correctly', async () => {
		const component = renderer
			.create(
				<ApolloProvider client={client}>
					<ApolloHooksProvider client={client}>
						<Vaken />
					</ApolloHooksProvider>
				</ApolloProvider>
			)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
