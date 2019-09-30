import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import Vaken from './app';
import STRINGS from './assets/strings.json';

const client = new ApolloClient({ uri: '/graphql' });

window.document.title = STRINGS.WEBSITE_HTML_TITLE;

const app = document.getElementById('App');
ReactDOM.render(
	<ApolloProvider client={client}>
		<Vaken />
	</ApolloProvider>,
	app
);
