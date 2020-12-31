import { QueryResolvers, UserType } from '../../generated/graphql';
import { queryById, checkIsAuthorized } from '../helpers';
import Context from '../../context';

export const TierQuery: QueryResolvers<Context> = {
	tier: async (root, { id }, ctx) => queryById(id, ctx.models.Tiers),
	tiers: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.Tiers.find().toArray();
	},
};
