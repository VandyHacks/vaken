import { QueryResolvers, UserType } from '../../generated/graphql';
import { queryById, checkIsAuthorized } from '../helpers';
import Context from '../../context';

export const TeamQuery: QueryResolvers<Context> = {
	team: async (root, { id }, ctx) => queryById(id, ctx.models.Teams),
	teams: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.Teams.find().toArray();
	},
};
