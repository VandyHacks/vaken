import { Strategy } from 'passport-google-oauth20';
import { verifyCallback } from './helpers';
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
		},
		(_, __, profile, done) => void verifyCallback(models, profile, done)
	);
