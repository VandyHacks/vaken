import { Strategy, VerifyCallback as GVerifyCallback } from 'passport-google-oauth20';
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
		// explicitly typing done to clarify the difference in the two VerifyCallback signatures
		(_, __, profile, done: GVerifyCallback) => {
			void processOAuthCallback(models, profile, (err, user, info) => {
				// the Google verifyCallback function has a *slightly* different call signature for the first param
				// the way we call this function uses wants Error | null | undefined
				// Google wants Error | string | undefined because of course it does
				// we just need to take care of the difference between null/undefined and we're fine
				// I want to note here that passport and the google passport library are made by the same ****ing person
				let coercedErr: Error | string | undefined;

				if (err == null) coercedErr = undefined;
				else coercedErr = err;

				return done(coercedErr, user, info);
			});
		}
	);
