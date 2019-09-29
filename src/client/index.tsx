import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import Vaken from './app';

const client = new ApolloClient({ uri: '/graphql' });

document.addEventListener('focus', () => {
	const body = document.getElementsByTagName('body')[0];
	body.scrollTop = 0;
	body.scrollLeft = 0;
});

const app = document.getElementById('App');
ReactDOM.render(
	<ApolloProvider client={client}>
		<Vaken />
	</ApolloProvider>,
	app
);
