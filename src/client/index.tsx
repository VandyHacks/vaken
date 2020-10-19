import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import * as Sentry from '@sentry/browser';
import Vaken from './app';
import STRINGS from './assets/strings.json';

Sentry.init({ dsn: STRINGS.SENTRY_URL, tracesSampleRate: 1.0 });

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
