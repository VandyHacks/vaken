import koa from 'koa';
import koaRouter from 'koa-router';
import serve from 'koa-static';
import mongoose from 'mongoose';
import passport from 'koa-passport';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import userRouter from './api/UserRouter';
import graphqlClient from './graphql';
import gql from 'graphql-tag';

const app = new koa();
const router = new koaRouter();

// Default port to listen
const port = 8080;

// GraphQL test
graphqlClient
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

// Define a route handler for the default home page
app.use(serve(__dirname + '/app'));

app.use(session(app));
app.use(bodyParser());
app.keys = ['secretsauce'];

// Authentication using Passport
require('dotenv').config();
require('./auth');
app.use(passport.initialize());
app.use(passport.session());

// Add the defined routes to the application
app.use(router.routes());
app.use(userRouter.routes());

// Connect to mongo database
mongoose.connect('mongodb://localhost:27017/test').then(
	() => {
		console.log('>>> MongoDB Connected');
	},
	err => {
		console.log('err:', err);
	}
);

// Begin listening on the defined port
const server = app.listen(port, () => {
	console.log(`>>> Server started at http://localhost:${port}`);
});
