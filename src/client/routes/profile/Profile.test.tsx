import React from 'react';
import renderer from 'react-test-renderer';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import { Profile } from './Profile';

const client = new ApolloClient({ uri: '/graphql' });

describe('Test Profile', () => {
	it('renders correctly', async () => {
		const component = renderer
			.create(
				<ApolloProvider client={client}>
					<Profile />
				</ApolloProvider>
			)
			.toJSON();
		expect(component).toMatchSnapshot();
	});
});
