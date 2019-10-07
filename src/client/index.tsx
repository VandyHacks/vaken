import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/react-hooks';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import * as Sentry from '@sentry/browser';
import Vaken from './app';
import STRINGS from './assets/strings.json';

Sentry.init({ dsn: STRINGS.SENTRY_URL });

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

window.document.title = STRINGS.WEBSITE_HTML_TITLE;

const app = document.getElementById('App');
ReactDOM.render(
	<ApolloProvider client={client}>
		<Vaken />
	</ApolloProvider>,
	app
);
