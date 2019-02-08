import koa from 'koa';
import koaRouter from 'koa-router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import passport from 'koa-passport';
import session from 'koa-session';
import { ApolloServer, gql } from 'apollo-server-koa';
import userRouter from './api/UserRouter';
import { schema } from './data/schema';

const app = new koa();
const router = new koaRouter();

// Default port to listen
const port = 8080;

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

// GraphQL
const apollo = new ApolloServer({ schema });
apollo.applyMiddleware({ app });

// Begin listening on the defined port
const server = app.listen(port, () => {
	console.log(`>>> Server started at http://localhost:${port}${apollo.graphqlPath}`);
});
