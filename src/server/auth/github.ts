import { Strategy } from 'passport-github2';
import { GITHUB_CALLBACK_URL } from '../config';
import { verifyCallback } from './helpers';
import { Models } from '../models';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;

if (GITHUB_CLIENT_ID == null) {
	throw new Error('GITHUB_CLIENT_ID not set');
}
if (GITHUB_CLIENT_SECRET == null) {
	throw new Error('GITHUB_CLIENT_SECRET not set');
}

export const strategy = (models: Models): Strategy =>
	new Strategy(
		{
			callbackURL: GITHUB_CALLBACK_URL,
			clientID: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			passReqToCallback: false,
		},
		(accessToken, refreshToken, results, profile, verified) =>
			void verifyCallback(models, profile, verified)
	);

export default {
	strategy,
};
