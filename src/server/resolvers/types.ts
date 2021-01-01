import { Resolvers, UserDbInterface } from '../generated/graphql';

/**
 * The __resolveType function is used by graphql to be able to tell if it should resolve extra fields in cases of polymorphic return values (like this). as well as for updating the client-side cache (keyed to _id and __userType)
 * Because we set up all of our usertypes to subclass User, we can return a generic User type form queries/mutations and supply extra fields which should be included for different subclasses. This makes all of our graphql return types discriminated union types based on the userType field, which enables really awesome type behavior for the polymorphic fields after matching the returned user.userType field matches the expected subtype.
 * GraphQL Code Generator's default __resolveType type (in the version in which this code was written, at least) only allows a return value of "User", which would prevent this polymorphic behavior from ever happening. Therefore, the CustomResolvers type specifies a different User.__resolveType signature.
 */
export type CustomResolvers<T> = Omit<Resolvers<T>, 'User'> & {
	User: {
		__resolveType: (
			user: UserDbInterface
		) => 'Hacker' | 'Mentor' | 'Organizer' | 'Sponsor' | 'Volunteer';
	};
};
