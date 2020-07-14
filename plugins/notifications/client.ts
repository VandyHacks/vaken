import { UserType } from '../../src/client/generated/graphql';

export class NotificationPlugin {
	get routeInfo() {
		return {
			displayText: 'Send a Notification',
			path: '/notifications',
			authLevel: [UserType.Organizer],
		};
	}

	async component() {
		return await import('./components/notification');
	}
}

export default {
	NotificationPlugin,
};
