import { AuthenticationError } from 'apollo-server-express';
import { QueryResolvers, UserType } from '../../generated/graphql';
import Context from '../../context';
import { checkIsAuthorized, fetchUser } from '../helpers';
import { getResumeDumpUrl, getSignedReadUrl } from '../../storage/gcp';
import { EventQuery } from './EventQueryResolvers';
import { CompanyQuery } from './CompanyQueryResolvers';
import { HackerQuery } from './HackerQueryResolvers';
import { MentorQuery } from './MentorQueryResolvers';
import { OrganizerQuery } from './OrganizerQueryResolvers';
import { SponsorQuery } from './SponsorQueryResolvers';
import { TeamQuery } from './TeamQueryResolvers';
import { TierQuery } from './TierQueryResolvers';

export const Query: QueryResolvers<Context> = {
	...EventQuery,
	...CompanyQuery,
	...HackerQuery,
	me: async (root, args, ctx) => {
		if (!ctx.user) throw new AuthenticationError(`user is not logged in`);
		return fetchUser(ctx.user, ctx.models);
	},
	...MentorQuery,
	...OrganizerQuery,
	signedReadUrl: async (_, { input }, { user }) => {
		if (!user) throw new AuthenticationError(`cannot get read url: user not logged in`);

		// No file to get :)
		if (!input) return '';

		// Hackers may get their own files; organizers may get any file
		if (!input.includes((user._id as unknown) as string))
			checkIsAuthorized([UserType.Organizer, UserType.Sponsor], user);

		return getSignedReadUrl(input);
	},
	resumeDumpUrl: async (_, __, { user }) => {
		if (!user) throw new AuthenticationError(`cannot get resumes: user not logged in`);

		// Only organizers and sponsors can get
		// TODO: @samlee514 tier checking is only done on front end, should be backend as well
		checkIsAuthorized([UserType.Organizer, UserType.Sponsor], user);

		return getResumeDumpUrl();
	},
	...SponsorQuery,
	...TeamQuery,
	...TierQuery,
};
