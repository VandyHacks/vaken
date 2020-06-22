/* eslint-disable */

import { NFCPlugin } from './plugins/nfc/server';
import { NotificationPlugin } from './plugins/notifications/server';


export default [
	{
		package: [new (NFCPlugin), new (NotificationPlugin)]
	},
];
