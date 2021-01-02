import { QueryResolvers, UserType } from '../../generated/graphql';
import { queryById, checkIsAuthorized } from '../helpers';
import Context from '../../context';

export const MentorQuery: QueryResolvers<Context> = {
	mentor: async (root, { id }, ctx) => queryById(id, ctx.models.Mentors),
	mentors: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer], ctx.user);
		return ctx.models.Mentors.find().toArray();
	},
};
