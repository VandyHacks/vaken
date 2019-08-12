import { Strategy } from 'passport-google-oauth20';
import { GOOGLE_CALLBACK_URL } from '../config';
import { verifyCallback } from './helpers';
import { Models } from '../models';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;

if (GOOGLE_CLIENT_ID == null) {
	throw new Error('GOOGLE_CLIENT_ID not set');
}
if (GOOGLE_CLIENT_SECRET == null) {
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
		(accessToken, refreshToken, profile, done) => void verifyCallback(models, profile, done)
	);

export default {
	strategy,
};
