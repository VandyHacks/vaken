import koa from 'koa';
import koaRouter from 'koa-router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import passport from 'koa-passport';
import session from 'koa-session';
import { MongoClient, ObjectID } from 'mongodb';
import { ApolloServer, gql } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';

import userRouter from './api/UserRouter';
import { UserResolver } from './resolvers/UserResolver';
import { HackerResolver } from './resolvers/HackerResolver';
import { MentorResolver } from './resolvers/MentorResolver';
import { OrganizerResolver } from './resolvers/OrganizerResolver';
import { SponsorRepResolver } from './resolvers/SponsorRepResolver';
import { SponsorResolver } from './resolvers/SponsorResolver';

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

/*
 * Graph QL
 */

/**
 * Build a schema, configure an Apollo server, and connect Koa
 */
async function launchServer() {
	// build TypeGraphQL executable schema
	const schema = await buildSchema({
		resolvers: [
			HackerResolver,
			MentorResolver,
			OrganizerResolver,
			SponsorRepResolver,
			SponsorResolver,
			UserResolver,
		],
		// automatically create `schema.gql` file with schema definition in current folder
		// emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
	});

	// Create GraphQL server
	const apollo = new ApolloServer({
		playground: true,
		// enable GraphQL Playground
		schema,
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
