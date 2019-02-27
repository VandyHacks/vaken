import koa from 'koa';
import koaRouter from 'koa-router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import passport from 'koa-passport';
import session from 'koa-session';
import { ApolloServer, gql } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';

import userRouter from './api/UserRouter';
import { UserResolver } from './resolvers/UserResolver';

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
mongoose.connect('mongodb://localhost:32772/test').then(
	() => {
		console.log('>>> MongoDB Connected');
	},
	err => {
		console.log('err:', err);
	}
);

/*
 * Graph QL
 */

/**
 * Build a schema, configure an Apollo server, and connect Koa
 */
async function launchServer() {
	// build TypeGraphQL executable schema
	const schema = await buildSchema({
		resolvers: [UserResolver],
		// automatically create `schema.gql` file with schema definition in current folder
		// emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
	});

	// Create GraphQL server
	const apollo = new ApolloServer({
		schema,
		// enable GraphQL Playground
		playground: true,
	});

	apollo.applyMiddleware({ app });

	// Begin listening on the defined port
	const server = app.listen(port, () => {
		console.log(`>>> Server started at http://localhost:${port}${apollo.graphqlPath}`);
	});
}

// Launch server with GraphQL endpoint
launchServer();

// Copyright (c) 2019 Vanderbilt University
