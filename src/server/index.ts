import koa from 'koa';
import koaRouter from 'koa-router';
import serve from 'koa-static';
import mongoose from 'mongoose';
import { ApolloClient } from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { fetch } from 'cross-fetch';
import gql from 'graphql-tag';
import { Profile } from 'passport-google-oauth';
import passport from 'koa-passport';
import session from 'koa-session';
import bodyParser from 'koa-bodyparser';
import { userModel } from './models/User';
import userRouter from './api/UserRouter';
// const cors = require('@koa/cors');

const app = new koa();
const router = new koaRouter();

// Default port to listen
const port = 8080;

const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: new HttpLink({
		// https://www.apollographql.com/docs/react/essentials/get-started.html
		fetch,
		uri: 'https://48p1r2roz4.sse.codesandbox.io',
	}),
	ssrMode: true,
});

// Define a route handler for the default home page
app.use(serve(__dirname + '/app'));

app.use(session(app));
app.use(bodyParser());
app.keys = ['secretsauce'];
app.use(passport.initialize());
app.use(passport.session());

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
		console.log('err:', err);
	}
);

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const passportFunc = (
	req: Request,
	accessToken: string,
	refreshToken: string,
	profile: Profile,
	done: (error: any, user?: any) => void
) => {
	console.log('reaching verify function');
	console.log(
		'accessToken: ',
		accessToken,
		'\n\nrefreshToken:',
		refreshToken,
		'\n\nProfile:',
		profile,
		'\n\ndone:',
		done
	);
	// const user = { id: 1, username: 'test', password: 'test' };
	// return async function() {
	// 	return user;
	// };
	return done(null, profile);
};

passport.use(
	new GoogleStrategy(
		{
			callbackURL: '/api/auth/google/callback',
			clientID: '618083589547-ml4cn37revrqicla2v54unetvs4fmamb.apps.googleusercontent.com',
			clientSecret: 'MZA4cxy9COavEP6iPhW_SesL',
			passReqToCallback: true,
		},
		passportFunc
	)
);

// passport.serializeUser((user: object, cb: (err: any, user: object) => void) => cb(null, user));
// passport.deserializeUser((obj: object, cb: (err: any, user: object) => void) => cb(null, obj));

passport.serializeUser(function(user: { id: any }, done: (arg0: null, arg1: any) => void) {
	done(null, user.id);
});

passport.deserializeUser(function(
	id: any,
	done: (arg0: null, arg1: { username: string; password: string }) => void
) {
	done(null, { username: 'Alice', password: 'password' });
});

// Begin listening on the defined port
const server = app.listen(port, () => {
	console.log(`>>> Server started at http://localhost:${port}`);
});
