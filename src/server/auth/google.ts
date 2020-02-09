import { Strategy } from 'passport-google-oauth20';
import processOAuthCallback from './processOAuthCallback';
import { Models } from '../models';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

if (!GOOGLE_CLIENT_ID) {
	throw new Error('GOOGLE_CLIENT_ID not set');
}
if (!GOOGLE_CLIENT_SECRET) {
	throw new Error('GOOGLE_CLIENT_SECRET not set');
}
if (!GOOGLE_CLIENT_SECRET) {
	throw new Error('GOOGLE_CLIENT_SECRET not set');
}

export const strategy = (models: Models): Strategy =>
	new Strategy(
		{
			callbackURL: GOOGLE_CALLBACK_URL,
			clientID: GOOGLE_CLIENT_ID,
			clientSecret: GOOGLE_CLIENT_SECRET,
			passReqToCallback: false,
			scope: ['openid', 'profile', 'email'],
		},
		(_, __, profile, done) => {
			void processOAuthCallback(
				models,
				profile,
				(err, user, info) =>
					// the Google verifyCallback function has a *slightly* different call signature for the first param
					// the idiomatic one that we use wants Error | null | undefined
					// Google wants Error | string | undefined because of course it does
					// see https://www.typescriptlang.org/docs/handbook/advanced-types.html#instanceof-type-guards
					void done(err instanceof Error ? err : new Error(err as string | undefined), user, info)
			);
		}
	);
