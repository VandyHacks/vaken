import koa from 'koa';
import koaRouter from 'koa-router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import passport from 'koa-passport';
import session from 'koa-session';
import { ApolloServer } from 'apollo-server-koa';
import { buildSchema } from 'type-graphql';

import userRouter from './api/UserRouter';
import UserResolver from './resolvers/UserResolver';
import HackerResolver from './resolvers/HackerResolver';
import MentorResolver from './resolvers/MentorResolver';
import OrganizerResolver from './resolvers/OrganizerResolver';
import SponsorRepResolver from './resolvers/SponsorRepResolver';
import SponsorResolver from './resolvers/SponsorResolver';
import TeamResolver from './resolvers/TeamResolver';
import logger from './logger';

// eslint-disable-next-line new-cap
const app = new koa();
// eslint-disable-next-line new-cap
const router = new koaRouter();

// Default port to listen
const PORT = process.env.PORT || 8080;

// Define a route handler for the default home page
app.use(serve(`${__dirname}/app`));

app.use(session(app));
app.use(bodyParser());
app.keys = ['secretsauce'];

// Authentication using Passport
if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}
require('./auth');

app.use(passport.initialize());
app.use(passport.session());

// Add the defined routes to the application
app.use(router.routes());
app.use(userRouter.routes());

const DB_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/test';

// Connect to mongo database
mongoose
	.connect(DB_URL, {
		useCreateIndex: true,
		useFindAndModify: false,
		useNewUrlParser: true,
	})
	.then(
		(): void => {
			logger.info('>>> MongoDB Connected');
		},
		(err): void => {
			logger.error('err:', err);
		}
	);

/*
 * GraphQL
 */

/**
 * Build a schema, configure an Apollo server, and connect Koa
 * @returns {Promise<void>} no return
 */
async function launchServer(): Promise<void> {
	// build TypeGraphQL executable schema
	const schema = await buildSchema({
		resolvers: [
			HackerResolver,
			MentorResolver,
			OrganizerResolver,
			SponsorRepResolver,
			SponsorResolver,
			TeamResolver,
			UserResolver,
		],
		validate: false,
		// automatically create `schema.gql` file with schema definition in current folder
		// emitSchemaFile: path.resolve(__dirname, 'schema.gql'),
	});

	// Create GraphQL server
	const apollo = new ApolloServer({
		playground: true,
		schema,
	});

	apollo.applyMiddleware({ app });

	// Begin listening on the defined port
	app.listen(
		PORT,
		(): void => {
			logger.info(`>>> Server started at http://localhost:${PORT}${apollo.graphqlPath}`);
		}
	);
}

// Launch server with GraphQL endpoint
launchServer();
