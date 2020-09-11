import { ObjectID } from 'mongodb';
import { UserInputError } from 'apollo-server-express';
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
import { checkIsAuthorizedArray, queryById } from '../../src/server/resolvers/helpers';
import { Resolvers } from '../../src/server/generated/graphql';
import Context from '../../src/server/context';
import { sendNotificationEmail } from './email/aws';
import { sendMessageToRole } from './helpers/discord';

export class NotificationPlugin {
	get schema() {
		return schema;
	}

	get resolvers(): Pick<Resolvers<Context>, '_Plugin__Notification' | 'Mutation' | 'Query'> {
		return {
			_Plugin__Notification: {
				deliveryTime: async notification => {
					const time = (await notification).deliveryTime;
					if (time) return time.getTime();
					return null;
				},
				message: async notification => (await notification).message,
				id: async notification => (await notification)._id.toHexString(),
				platforms: async notification => (await notification).platforms,
				userTypes: async notification => (await notification).userTypes,
				subject: async notification => (await notification).subject,
				discordRole: async notification => (await notification).discordRole,
			},
			Query: {
				_Plugin__notification: async (root, { id }, ctx) => {
					checkIsAuthorizedArray([UserType.Organizer], ctx.user);
					return queryById(
						id,
						ctx.db.collection<_Plugin__NotificationDbObject>('_Plugin__notifications')
					);
				},
				_Plugin__notifications: async (root, args, ctx) => {
					checkIsAuthorizedArray([UserType.Organizer], ctx.user);
					return ctx.db
						.collection<_Plugin__NotificationDbObject>('_Plugin__notifications')
						.find()
						.toArray();
				},
			},
			Mutation: {
				_Plugin__createNotification: async (root, { input }, ctx) => {
					checkIsAuthorizedArray([UserType.Organizer], ctx.user);
					let time = new Date();
					if (input.deliveryTime) {
						time = new Date(input.deliveryTime);
					}
					const notification: _Plugin__NotificationDbObject = {
						_id: new ObjectID(),
						message: input.message,
						userTypes: input.userTypes,
						platforms: input.platforms,
						deliveryTime: time,
						subject: input.subject,
						discordRole: input.discordRole,
					};

					ctx.db
						.collection<_Plugin__NotificationDbObject>('_Plugin__notifications')
						.insertOne(notification);

					if (notification.platforms.includes(_Plugin__Platform.Email)) {
						if (!notification.userTypes) {
							throw new UserInputError('Please specify userTypes');
						} else if (!notification.subject) {
							throw new UserInputError('Please specify email subject');
						} else {
							let users: UserDbInterface[] = [];
							if (notification.userTypes.includes(UserType.Hacker)) {
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

							users.forEach((user: UserDbInterface) => {
								sendNotificationEmail(user, notification.message, notification.subject || '');
							});
						}
					}

					if (notification.platforms.includes(_Plugin__Platform.Discord)) {
						if (!notification.discordRole) {
							throw new UserInputError('Please specify discordRole');
						} else {
							await sendMessageToRole(notification.discordRole, notification.message);
						}
					}

					return notification;
				},
			},
		};
	}
}

export default NotificationPlugin;
