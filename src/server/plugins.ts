/* eslint-disable */
import { NotificationPlugin } from '../../plugins/notifications/server';
import { NFCPlugin } from '../../plugins/nfc/server';
import { GoogleOAuth } from '../../plugins/google-oauth';
import { GitHubOAuth } from '../../plugins/github-oauth';
import processOAuthCallback from './auth/processOAuthCallback';

// import Google OAuth requirements
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL as string;

// import GitHub OAuth requirements
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID as string;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET as string;
const GITHUB_CALLBACK_URL = process.env.GITHUB_CALLBACK_URL as string;

// Add plugins that need to associate GraphQL and MongoDB models here
export const serverPlugins = [new NFCPlugin(), new NotificationPlugin()];

// Add plugins that are using the Passport OAuth patterns here
export const authPlugins = [
	new GoogleOAuth({
		settings: {
			GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET,
			GOOGLE_CALLBACK_URL,
			processOAuthCallback,
		},
	}),
	new GitHubOAuth({
		settings: {
			GITHUB_CLIENT_ID,
			GITHUB_CLIENT_SECRET,
			GITHUB_CALLBACK_URL,
			processOAuthCallback,
		},
	}),
];

// export default { server, auth };
