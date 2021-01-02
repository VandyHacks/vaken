import Context from '../context';
import { SponsorResolvers, UserType, SponsorStatus } from '../generated/graphql';
import { toEnum } from './helpers';
import { User } from './UserResolver';

export const Sponsor: SponsorResolvers<Context> = {
	...User,
	status: async sponsor => toEnum(SponsorStatus)((await sponsor).status),
	userType: () => UserType.Sponsor,
	company: async sponsor => (await sponsor).company,
};
