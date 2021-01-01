import { ObjectID } from 'mongodb';
import { QueryResolvers, UserType, SponsorDbObject } from '../../generated/graphql';
import { queryById, checkIsAuthorized } from '../helpers';
import Context from '../../context';

export const EventQuery: QueryResolvers<Context> = {
	event: async (root, { id }, ctx) => queryById(id, ctx.models.Events),
	eventCheckIn: async (root, { id }, ctx) => queryById(id, ctx.models.EventCheckIns),
	eventCheckIns: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.EventCheckIns.find().toArray();
	},
	events: async (root, args, ctx) => {
		const user = checkIsAuthorized(
			[UserType.Organizer, UserType.Sponsor, UserType.Hacker],
			ctx.user
		);
		if (user.userType === UserType.Sponsor) {
			const { _id } = (user as SponsorDbObject).company;
			const events = await ctx.models.Events.find({ 'owner._id': new ObjectID(_id) }).toArray();
			return events;
		}
		if (user.userType === UserType.Organizer || user.userType === UserType.Hacker) {
			return ctx.models.Events.find().toArray();
		}
		return ctx.models.Events.find({ owner: null }).toArray();
	},
	eventsForHackers: async (root, args, ctx) => {
		checkIsAuthorized(UserType.Hacker, ctx.user);
		return ctx.models.Events.find().toArray();
	},
};
