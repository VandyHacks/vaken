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

const app = new koa();
const router = new koaRouter();
const client = new ApolloClient({
	ssrMode: true,
	link: new HttpLink({
		uri: '/graphql',
		fetch,
	}),
	cache: new InMemoryCache(),
});

// Default port to listen
const port = 8080;

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
	.then(result => console.log(result));

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
