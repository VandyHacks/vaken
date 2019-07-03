import { Strategy } from 'passport-github2';
import { GITHUB_CALLBACK_URL } from '../config';
import { verifyCallback } from './helpers';

if (process.env.GITHUB_CLIENT_ID == null) {
	throw new Error('GITHUB_CLIENT_ID not set');
}
if (process.env.GITHUB_CLIENT_SECRET == null) {
	throw new Error('GITHUB_CLIENT_SECRET not set');
}

export const strategy = new Strategy(
	{
		callbackURL: GITHUB_CALLBACK_URL,
		clientID: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET,
		passReqToCallback: false,
	},
	(accessToken, refreshToken, results, profile, verified) => void verifyCallback(profile, verified)
);

export default {
	strategy,
};
