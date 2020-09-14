import { OIDCStrategy as Strategy, IProfile } from 'passport-azure-ad';
import { VerifyCallback } from 'passport-oauth2';
import { Profile } from 'passport';
import processOAuthCallback from './processOAuthCallback';
import { Models } from '../models';

const {
	MSFT_CLIENT_ID: clientID,
	MSFT_CLIENT_SECRET: clientSecret,
	MSFT_REDIRECT_URL: redirectUrl,
} = process.env;

if (!clientID) throw new Error('MSFT_CLIENT_ID not set');

if (!clientSecret) throw new Error('MSFT_CLIENT_SECRET not set');

if (!redirectUrl) throw new Error('MSFT_REDIRECT_URL not set');

export const strategy = (models: Models): Strategy =>
	new Strategy(
		{
			allowHttpForRedirectUrl: true,
			clientID,
			clientSecret,
			// yes, identitymetadata should be set explicitly
			// it would only have to be changed if you wanted to restrict it to a single org's internal directory
			identityMetadata:
				'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
			loggingLevel: 'error',
			passReqToCallback: false,
			redirectUrl,
			responseMode: 'query',
			responseType: 'code',
			scope: ['email'],
			validateIssuer: false,
		},
		(profile: IProfile, done: VerifyCallback) => {
			const coercedProfile: Profile = {
				displayName: profile.displayName || '',
				id: profile.sub || profile._json.sub,
				provider: 'microsoft',
				emails: [{ value: profile._json.email }],
			};
			void processOAuthCallback(models, coercedProfile, done);
		}
	);
