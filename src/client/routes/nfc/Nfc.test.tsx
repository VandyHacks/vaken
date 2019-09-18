import React from 'react';
import renderer from 'react-test-renderer';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { Nfc } from './Nfc';

const client = new ApolloClient({ uri: '/graphql' });

describe('Test Nfc', () => {
	it('renders correctly', async () => {
		const component = renderer
			.create(
				<ApolloProvider client={client}>
					<Nfc />
				</ApolloProvider>
			)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
