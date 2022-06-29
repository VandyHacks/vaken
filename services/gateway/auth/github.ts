import { Strategy } from 'passport-github2';
import { RequestHandler } from 'express';
import passport from 'passport';
import { notEmpty } from '../../../common/util/predicates';
import { logInUser } from './login';

const {
	GITHUB_CLIENT_ID: clientID,
	GITHUB_CLIENT_SECRET: clientSecret,
	GITHUB_CALLBACK_URL: callbackURL,
} = process.env;

if (!clientID) {
	console.warn('GITHUB_CLIENT_ID not set');
} else if (!clientSecret) {
	console.warn('GITHUB_CLIENT_SECRET not set');
} else if (!callbackURL) {
	console.warn('GITHUB_CALLBACK_URL not set');
}
if (!clientID || !clientSecret || !callbackURL) {
	console.warn('GitHub auth environment variable(s) missing. GitHub auth will be disabled.');
}

export const GitHubOauthRoutes: Array<{ path: string; handler: RequestHandler }> = [];
if (clientID && clientSecret && callbackURL) {
	GitHubOauthRoutes.push(
		{
			path: '/api/auth/github',
			handler: passport.authenticate('github', { scope: ['user:email'] }),
		},
		{
			path: '/api/auth/github/callback',
			handler: passport.authenticate('github', {
				failureRedirect: '/login',
				successRedirect: '/',
			}),
		}
	);

	passport.use(
		'github',
		new Strategy(
			{
				callbackURL,
				clientID,
				clientSecret,
				passReqToCallback: false,
				scope: ['user:email'], // fetches non-public emails as well
			},
			async (_, __, ___, profile, done) => {
				const email = profile.emails?.map((e: { value?: string }) => e.value).filter(notEmpty)[0];
				if (!email) {
					done(new Error(`Email not provided by provider ${JSON.stringify(profile)}`));
					return;
				}
				const user = await logInUser({ email, provider: 'github', token: profile.id });
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
