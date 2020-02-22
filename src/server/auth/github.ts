import { Strategy } from 'passport-github2';
import processOAuthCallback from './processOAuthCallback';
import { Models } from '../models';

const {
	GITHUB_CLIENT_ID: clientID,
	GITHUB_CLIENT_SECRET: clientSecret,
	GITHUB_CALLBACK_URL: callbackURL,
} = process.env;

if (!clientID) {
	throw new Error('GITHUB_CLIENT_ID not set');
}
if (!clientSecret) {
	throw new Error('GITHUB_CLIENT_SECRET not set');
}
if (!callbackURL) {
	throw new Error('GITHUB_CALLBACK_URL not set');
}

export const strategy = (models: Models): Strategy =>
	new Strategy(
		{
			callbackURL,
			clientID,
			clientSecret,
			passReqToCallback: false,
			scope: ['user:email'], // fetches non-public emails as well
		},
		(_, __, ___, profile, verified) => void processOAuthCallback(models, profile, verified)
	);
