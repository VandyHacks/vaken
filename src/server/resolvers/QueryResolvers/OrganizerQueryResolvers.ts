import { QueryResolvers, UserType } from '../../generated/graphql';
import { queryById, checkIsAuthorized } from '../helpers';
import Context from '../../context';

export const OrganizerQuery: QueryResolvers<Context> = {
	organizer: async (root, { id }, ctx) => queryById(id, ctx.models.Organizers),
	organizers: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.Organizers.find().toArray();
	},
};
