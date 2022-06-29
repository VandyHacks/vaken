import { RequestHandler } from 'express';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { notEmpty } from '../../../common/util/predicates';
import { logInUser } from './login';

const {
	GOOGLE_CLIENT_ID: clientID,
	GOOGLE_CLIENT_SECRET: clientSecret,
	GOOGLE_CALLBACK_URL: callbackURL,
} = process.env;

if (!clientID) {
	console.warn('GOOGLE_CLIENT_ID not set');
} else if (!clientSecret) {
	console.warn('GOOGLE_CLIENT_SECRET not set');
} else if (!callbackURL) {
	console.warn('GOOGLE_CALLBACK_URL not set');
}
if (!clientID || !clientSecret || !callbackURL) {
	console.warn('Google auth environment variable(s) missing. Google auth will be disabled.');
}

export const GoogleOauthRoutes: Array<{ path: string; handler: RequestHandler }> = [];
if (clientID && clientSecret && callbackURL) {
	GoogleOauthRoutes.push(
		{
			path: '/api/auth/google',
			handler: passport.authenticate('google', { scope: ['openid', 'profile', 'email'] }),
		},
		{
			path: '/api/auth/google/callback',
			handler: passport.authenticate('google', {
				failureRedirect: '/login',
				successRedirect: '/',
			}),
		}
	);

	passport.use(
		'google',
		new Strategy(
			{
				callbackURL,
				clientID,
				clientSecret,
				passReqToCallback: false,
				scope: ['openid', 'profile', 'email'],
			},
			async (_, __, profile, done) => {
				const email = profile.emails?.map(e => e.value).filter(notEmpty)[0];
				if (!email) {
					done(new Error(`Email not provided by provider ${JSON.stringify(profile)}`));
					return;
				}
				const user = await logInUser({ email, provider: 'google', token: profile.id });
				if (!user) {
					done(new Error('Error logging in user'));
				} else {
					// The user passed to this `done` callback is serialized into the session.
					done(undefined, user);
				}
			}
		)
	);
}
