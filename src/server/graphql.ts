import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { fetch } from 'cross-fetch';

const graphqlClient = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		// https://www.apollographql.com/docs/react/essentials/get-started.html
		fetch,
		uri: 'https://48p1r2roz4.sse.codesandbox.io',
	}),
	ssrMode: true,
});

export default graphqlClient;
