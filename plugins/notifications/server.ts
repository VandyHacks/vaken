import { ObjectID } from 'mongodb';
import {
	HackerDbObject,
	SponsorDbObject,
	MentorDbObject,
	OrganizerDbObject,
	UserType,
	_Plugin__NotificationDbObject,
	_Plugin__Platform,
	UserDbInterface,
} from '../../src/client/generated/graphql';
import schema from './schema.graphql';
import {
	checkIsAuthorized,
	checkIsAuthorizedArray,
	queryById,
} from '../../src/server/resolvers/helpers';
import { Resolvers } from '../../src/server/generated/graphql';
import Context from '../../src/server/context';
import { sendNotificationEmail } from './email/aws';

export class NotificationPlugin {
	get schema() {
		return schema;
	}

	get resolvers(): Pick<Resolvers<Context>, 'Mutation' | 'Query' | '_Plugin__Notification'> {
		return {
			_Plugin__Notification: {
				deliveryTime: async notification => (await notification).deliveryTime.getTime(),
				message: async notification => (await notification).message,
				id: async notification => (await notification)._id.toHexString(),
				platforms: async notification => (await notification).platforms,
				userTypes: async notification => (await notification).userTypes,
				subject: async notification => (await notification).subject,
			},
			Query: {
				_Plugin__notification: async (root, { id }, ctx) => {
					return queryById(
						id,
						ctx.db.collection<_Plugin__NotificationDbObject>('_Plugin__notifications')
					);
				},
				_Plugin__notifications: async (root, args, ctx) => {
					// checkIsAuthorizedArray([UserType.Organizer], ctx.user);
					return ctx.db
						.collection<_Plugin__NotificationDbObject>('_Plugin__notifications')
						.find()
						.toArray();
				},
			},
			Mutation: {
				_Plugin__createNotification: async (root, { input }, ctx) => {
					// checkIsAuthorizedArray([UserType.Organizer], ctx.user);

					const notification: _Plugin__NotificationDbObject = {
						_id: new ObjectID(),
						message: input.message,
						userTypes: input.userTypes,
						platforms: input.platforms,
						deliveryTime: new Date(input.deliveryTime),
						subject: input.subject,
					};

					ctx.db
						.collection<_Plugin__NotificationDbObject>('_Plugin__notifications')
						.insertOne(notification);

					let users: any = [];
					if (input.userTypes.includes(UserType.Hacker)) {
						users = users.concat(
							await ctx.db
								.collection<HackerDbObject>('Hackers')
								.find()
								.toArray()
						);
					}

					if (notification.userTypes.includes(UserType.Sponsor)) {
						users.concat(
							await ctx.db
								.collection<SponsorDbObject>('sponsors')
								.find()
								.toArray()
						);
					}

					if (notification.userTypes.includes(UserType.Organizer)) {
						users = users.concat(
							await ctx.db
								.collection<OrganizerDbObject>('organizers')
								.find()
								.toArray()
						);
					}

					if (notification.userTypes.includes(UserType.Mentor)) {
						users = users.concat(
							await ctx.db
								.collection<MentorDbObject>('mentors')
								.find()
								.toArray()
						);
					}

					if (notification.platforms.includes(_Plugin__Platform.Email)) {
						users.forEach((user: any) => {
							sendNotificationEmail(
								user as UserDbInterface,
								notification.message,
								notification.subject || ''
							);
						});

						// Promise.all(
						// 	users.map(user => sendNotificationEmail(user.email, input.message, 'Test Subject'))
						// ).catch(err => {
						// 	console.log(err);
						// 	throw err;
						// });
					}

					return notification;
				},
			},
		};
	}
}

export default NotificationPlugin;
