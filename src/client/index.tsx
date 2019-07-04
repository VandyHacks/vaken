import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { ApolloProvider } from 'react-apollo';
import Vaken from './app';

const client = new ApolloClient({ uri: '/graphql' });

const app = document.getElementById('App');
ReactDOM.render(
	<ApolloProvider client={client}>
		<ApolloHooksProvider client={client}>
			<Vaken />
		</ApolloHooksProvider>
	</ApolloProvider>,
	app
);
