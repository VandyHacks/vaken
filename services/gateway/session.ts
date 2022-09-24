import session from 'express-session';
import { ObjectId } from 'mongodb';
import MongoStore from 'connect-mongo';
import passport from 'passport';
import { RequestHandler } from 'express';
import { getUser, LogInUserResult } from './auth/login';

let secret = process.env.SESSION_SECRET;
if (!secret) {
	console.warn('SESSION_SECRET not set. Sessions will not be preserved between restarts.');
	secret = new ObjectId().toHexString();
}
let mongoUrl = process.env.MONGODB_BASE_URL;
if (!mongoUrl) {
	console.warn('MONGODB_BASE_URL not set. Defaulting to `mongodb://localhost:27017`.');
	mongoUrl = 'mongodb://localhost:27017';
}
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

// Passport stores the information passed to the `done` callback in the serializeUser,
// then provides it as the first argument in the deserializerUser callback. See
// https://github.com/passport/todos-express-password/blob/ea2901e9952e6447172cfcbe8a03f238e6a4f87e/routes/auth.js#L34-L48
// for details.
//
// Our serialization function stores only the user's ID in the session, to keep the user fresh.
passport.serializeUser((user: LogInUserResult, done) => {
	process.nextTick(() => {
		done(null, { id: user?.id });
	});
});

// This deserialization function takes the user ID from the session and fetches
// the user's email and roles. It is made available via the `req.session.passport.user` field.
passport.deserializeUser(({ id }: { id: string }, done) => {
	process.nextTick(async () => {
		const user = await getUser(id);
		return done(null, user);
	});
});

const initializedSessionMiddleware = session({
	secret,
	store: MongoStore.create({ mongoUrl, dbName: 'vaken', crypto: { secret } }),
	saveUninitialized: false,
	resave: false,
	cookie: {
		maxAge: THIRTY_DAYS,
		httpOnly: true,
		// Using secure cookies requires an HTTPS connection. When running on heroku,
		// the last hop between Heroku's servers and our dyno is behind a proxy, so
		// specifying `trust proxy` in express is required.
		secure: true,
		sameSite: 'strict',
	},
});

export const sessionMiddleware: RequestHandler[] = [
	initializedSessionMiddleware,
	passport.initialize(),
	passport.session(),
	passport.authenticate(['session']),
];
