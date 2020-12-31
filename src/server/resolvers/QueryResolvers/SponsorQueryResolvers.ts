import { QueryResolvers, UserType } from '../../generated/graphql';
import { queryById, checkIsAuthorized } from '../helpers';
import Context from '../../context';

export const SponsorQuery: QueryResolvers<Context> = {
	sponsor: async (root, { id }, ctx: Context) => queryById(id, ctx.models.Sponsors),
	sponsors: async (root, args, ctx: Context) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.Sponsors.find().toArray();
	},
};
