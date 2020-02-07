/* eslint-disable */

import GoogleOauth from '../vaken-plugin-google';
import { verifyCallback } from 'src/server/auth/helpers';
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL } = process.env;

export default [
	{
		package: new GoogleOauth({permissions: [],
            settings: { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, verifyCallback }}
	}
];
