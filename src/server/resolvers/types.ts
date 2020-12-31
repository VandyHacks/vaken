import { Resolvers, UserDbInterface } from '../generated/graphql';

/**
 * Used to define a __resolveType function on the User resolver that doesn't take in a promise. This is important as it
 */
export type CustomResolvers<T> = Omit<Resolvers<T>, 'User'> & {
	User: {
		__resolveType: (
			user: UserDbInterface
		) => 'Hacker' | 'Mentor' | 'Organizer' | 'Sponsor' | 'Volunteer';
	};
};
