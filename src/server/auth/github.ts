import { Strategy } from 'passport-github2';
import { verifyCallback } from './helpers';
import { Models } from '../models';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } = process.env;

if (!GITHUB_CLIENT_ID) {
	throw new Error('GITHUB_CLIENT_ID not set');
}
if (!GITHUB_CLIENT_SECRET) {
	throw new Error('GITHUB_CLIENT_SECRET not set');
}
if (!GITHUB_CALLBACK_URL) {
	throw new Error('GITHUB_CALLBACK_URL not set');
}

export const strategy = (models: Models): Strategy =>
	new Strategy(
		{
			callbackURL: GITHUB_CALLBACK_URL,
			clientID: GITHUB_CLIENT_ID,
			clientSecret: GITHUB_CLIENT_SECRET,
			passReqToCallback: false,
			scope: ['user:email'], // fetches non-public emails as well
		},
		(_, __, ___, profile, verified) => void verifyCallback(models, profile, verified)
	);
