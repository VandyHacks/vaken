/* eslint-disable */

import { NFCPlugin } from '../../plugins/nfc/client';
// import { GoogleOAuth } from '../../plugins/google-oauth';
import { GoogleLogo } from '../../plugins/google-oauth/logo.svg';

export default {
	package: new NFCPlugin(),
	auth: { google: GoogleLogo },
};
