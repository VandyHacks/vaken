import { FunctionComponent } from 'react';
import { UserType } from '../../src/client/generated/graphql';

export class NFCPlugin {
	public readonly routeInfo: {
		displayText: string;
		path: string;
		authLevel: UserType[];
	};

	public readonly component: Promise<FunctionComponent>;

	constructor() {
		this.routeInfo = {
			displayText: 'Scan NFC (Plugin Version)',
			path: '/test_module',
			authLevel: [UserType.Organizer],
		};
		this.component = import('./components/Nfc').then(module => module.default);
	}
}

export default {
	NFCPlugin,
};
