import Context from '../context';
import { OrganizerResolvers, UserType } from '../generated/graphql';
import { User } from './UserResolver';

export const Organizer: OrganizerResolvers<Context> = {
	...User,
	permissions: async organizer => (await organizer).permissions,
	userType: () => UserType.Organizer,
};
