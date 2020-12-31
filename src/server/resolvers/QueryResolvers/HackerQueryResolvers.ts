import { QueryResolvers, UserType } from '../../generated/graphql';
import { queryById, checkIsAuthorized } from '../helpers';
import Context from '../../context';

export const HackerQuery: QueryResolvers<Context> = {
	hacker: async (root, { id }, ctx) => queryById(id, ctx.models.Hackers),
	hackers: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer, UserType.Volunteer, UserType.Sponsor], ctx.user);
		return ctx.models.Hackers.find().toArray();
	},
};
