import { OIDCStrategy as Strategy, IProfile } from 'passport-azure-ad';
import { VerifyCallback } from 'passport-oauth2';
import { verifyMicrosoftCallback } from './helpers';
import { Models } from '../models';

const { MSFT_CLIENT_ID, MSFT_CLIENT_SECRET, MSFT_REDIRECT_URL } = process.env;

if (!MSFT_CLIENT_ID) throw new Error('MSFT_CLIENT_ID not set');

if (!MSFT_CLIENT_SECRET) throw new Error('MSFT_CLIENT_SECRET not set');

if (!MSFT_REDIRECT_URL) throw new Error('MSFT_REDIRECT_URL not set');

export const strategy = (models: Models): Strategy =>
	new Strategy(
		{
			allowHttpForRedirectUrl: true,
			clientID: MSFT_CLIENT_ID,
			clientSecret: MSFT_CLIENT_SECRET,
			identityMetadata:
				'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
			loggingLevel: 'error',
			passReqToCallback: false,
			redirectUrl: MSFT_REDIRECT_URL,
			responseMode: 'query',
			responseType: 'code',
			scope: ['email'],
			validateIssuer: false,
		},
		(profile: IProfile, done: VerifyCallback) => void verifyMicrosoftCallback(models, profile, done)
	);

export default {
	strategy,
};
