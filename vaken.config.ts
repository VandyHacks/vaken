/* eslint-disable */

import processOAuthCallback from './src/server/auth/processOAuthCallback';

import { GoogleOAuth } from '../vaken-plugin-google';

// import Google OAuth requirements
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL as string;

export default [
	new GoogleOAuth({
		settings: {
			GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET,
			GOOGLE_CALLBACK_URL,
			processOAuthCallback,
		},
	}),
];
