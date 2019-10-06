import { OIDCStrategy as Strategy, IProfile } from 'passport-azure-ad';
import { VerifyCallback } from 'passport-oauth2';
import { verifyMicrosoftCallback } from './helpers';
import { Models } from '../models';

const { MSFT_CLIENT_ID, MSFT_CLIENT_SECRET, MSFT_REDIRECT_URL, MSFT_TENANT_NAME } = process.env;

if (!MSFT_CLIENT_ID) throw new Error('MSFT_CLIENT_ID not set');

if (!MSFT_CLIENT_SECRET) throw new Error('MSFT_CLIENT_SECRET not set');

if (!MSFT_REDIRECT_URL) throw new Error('MSFT_REDIRECT_URL not set');

if (!MSFT_TENANT_NAME) throw new Error('MSFT_TENANT_NAME not set');

export const strategy = (models: Models): Strategy =>
	new Strategy(
		{
			allowHttpForRedirectUrl: true,
			clientID: MSFT_CLIENT_ID,
			clientSecret: MSFT_CLIENT_SECRET,
			identityMetadata: MSFT_TENANT_NAME,
			loggingLevel: 'error',
			passReqToCallback: false,
			redirectUrl: `http://localhost:8081${MSFT_REDIRECT_URL}`, // TODO: FIX
			responseMode: 'query',
			responseType: 'code',
			scope: ['email'],
		},
		(profile: IProfile, done: VerifyCallback) => void verifyMicrosoftCallback(models, profile, done)
	);

export default {
	strategy,
};
