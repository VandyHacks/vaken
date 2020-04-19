/* eslint-disable */

import { NFCPlugin } from '../../plugins/nfc/client';
import GoogleLogo from '@vandyhacks/google-oauth/logo.svg';

export const packages = [new NFCPlugin()];
export const auth = { google: GoogleLogo };
