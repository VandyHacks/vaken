import React from 'react';
import renderer from 'react-test-renderer';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import Vaken from './app';

const client = new ApolloClient({ uri: '/graphql' });

describe('Test Vaken', () => {
	it('Vaken main app renders correctly', async () => {
		const component = renderer
			.create(
				<ApolloProvider client={client}>
					<Vaken />
				</ApolloProvider>
			)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
