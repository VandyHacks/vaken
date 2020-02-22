import { Strategy, VerifyCallback as GVerifyCallback } from 'passport-google-oauth20';
import processOAuthCallback from './processOAuthCallback';
import { Models } from '../models';

const {
	GOOGLE_CLIENT_ID: clientID,
	GOOGLE_CLIENT_SECRET: clientSecret,
	GOOGLE_CALLBACK_URL: callbackURL,
} = process.env;

if (!clientID) {
	throw new Error('GOOGLE_CLIENT_ID not set');
}
if (!clientSecret) {
	throw new Error('GOOGLE_CLIENT_SECRET not set');
}
if (!callbackURL) {
	throw new Error('GOOGLE_CALLBACK_URL not set');
}

export const strategy = (models: Models): Strategy =>
	new Strategy(
		{
			callbackURL,
			clientID,
			clientSecret,
			passReqToCallback: false,
			scope: ['openid', 'profile', 'email'],
		},
		// explicitly typing done to clarify the difference in the two VerifyCallback signatures
		(_, __, profile, done: GVerifyCallback) => {
			void processOAuthCallback(models, profile, (err, user, info) => {
				// the Google verifyCallback function has a *slightly* different call signature for the first param
				// the way we call this function uses Error | null | undefined
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
