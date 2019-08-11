import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import Vaken from './app';

const client = new ApolloClient({ uri: '/graphql' });

const app = document.getElementById('App');
ReactDOM.render(
	<ApolloProvider client={client}>
		<Vaken />
	</ApolloProvider>,
	app
);
