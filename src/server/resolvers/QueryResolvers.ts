import { ObjectID } from 'mongodb';
import { AuthenticationError } from 'apollo-server-express';
import { QueryResolvers, UserType, SponsorDbObject } from '../generated/graphql';
import Context from '../context';
import { queryById, checkIsAuthorized, fetchUser } from './helpers';
import { getSignedReadUrl } from '../storage/gcp';

export const Query: QueryResolvers<Context> = {
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
	company: async (root, { id }, ctx) => queryById(id, ctx.models.Companies),
	companies: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer, UserType.Volunteer], ctx.user);
		return ctx.models.Companies.find().toArray();
	},
	hacker: async (root, { id }, ctx) => queryById(id, ctx.models.Hackers),
	hackers: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], ctx.user);
		return ctx.models.Hackers.find().toArray();
	},
	me: async (root, args, ctx) => {
		if (!ctx.user) throw new AuthenticationError(`user is not logged in`);
		return fetchUser(ctx.user, ctx.models);
	},
	mentor: async (root, { id }, ctx) => queryById(id, ctx.models.Mentors),
	mentors: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.Mentors.find().toArray();
	},
	organizer: async (root, { id }, ctx) => queryById(id, ctx.models.Organizers),
	organizers: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.Organizers.find().toArray();
	},
	signedReadUrl: async (_, { input }, { user }) => {
		if (!user) throw new AuthenticationError(`cannot get read url: user not logged in`);

		// No file to get :)
		if (!input) return '';

		// Hackers may get their own files; organizers may get any file
		if (!input.includes((user._id as unknown) as string))
			checkIsAuthorized([UserType.Organizer, UserType.Sponsor], user);

		return getSignedReadUrl(input);
	},
	sponsor: async (root, { id }, ctx: Context) => queryById(id, ctx.models.Sponsors),
	sponsors: async (root, args, ctx: Context) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.Sponsors.find().toArray();
	},
	team: async (root, { id }, ctx) => queryById(id, ctx.models.Teams),
	teams: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.Teams.find().toArray();
	},
	tier: async (root, { id }, ctx) => queryById(id, ctx.models.Tiers),
	tiers: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.Tiers.find().toArray();
	},
};
