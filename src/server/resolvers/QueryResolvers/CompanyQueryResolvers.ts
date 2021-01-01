import { QueryResolvers, UserType } from '../../generated/graphql';
import { queryById, checkIsAuthorized } from '../helpers';
import Context from '../../context';

export const CompanyQuery: QueryResolvers<Context> = {
	company: async (root, { id }, ctx) => queryById(id, ctx.models.Companies),
	companies: async (root, args, ctx) => {
		checkIsAuthorized([UserType.Organizer, UserType.Volunteer], ctx.user);
		return ctx.models.Companies.find().toArray();
	},
};
