import React from 'react';
import renderer from 'react-test-renderer';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import Vaken from './app';

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: ApolloLink.from([
		onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors)
				graphQLErrors.forEach(({ message, locations, path }) =>
					console.error(
						`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
					)
				);
			if (networkError) console.error(`[Network error]: ${networkError}`);
		}),
		new HttpLink({
			credentials: 'same-origin',
			uri: '/graphql',
		}),
	]),
});

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
