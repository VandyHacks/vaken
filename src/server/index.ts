import koa from 'koa';
import koaRouter from 'koa-router';
import userRouter from './api/UserRouter';
import mongoose from 'mongoose';
import { userModel } from './models/User';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { fetch } from 'cross-fetch';
import gql from 'graphql-tag';

// Default port to listen
const port = 8080;

const app = new koa();
const router = new koaRouter();
const client = new ApolloClient({
	ssrMode: true,
	link: new HttpLink({
		// https://www.apollographql.com/docs/react/essentials/get-started.html
		uri: 'https://48p1r2roz4.sse.codesandbox.io',
		fetch,
	}),
	cache: new InMemoryCache(),
});

// Define a route handler for the default home page
router.get('/', (ctx, next) => {
	ctx.body = 'Hello World!';
});

// Mongo test
router.post('/mongo', async (ctx, next) => {
	const newUser = new userModel(ctx.request.query);
	await newUser.save();
	const user = await userModel.findOne({ firstName: 'vandy' });
	console.log(user);
});

// GraphQL test
client
	.query({
		query: gql`
			{
				rates(currency: "USD") {
					currency
				}
			}
		`,
	})
	.then(
		result => {
			// console.log(result);
			console.log('GraphQL test: successful');
		},
		err => {
			console.log(err);
		}
	);

// Add the defined routes to the application
app.use(router.routes());
app.use(userRouter.routes());

mongoose.connect('mongodb://localhost:27017/test').then(
	() => {
		console.log('>>> MongoDB Connected');
	},
	err => {
		console.log(err);
	}
);

// Begin listening on the defined port
const server = app.listen(port, () => {
	console.log(`>>> Server started at http://localhost:${port}`);
});
