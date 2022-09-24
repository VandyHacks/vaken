import { allow, IRules, shield, or } from 'graphql-shield';
import { Query, Mutation, User } from './lib/generated.graphql';
import {
	hasBearerToken,
	isOrganizer,
	isQueryingSelf,
	isSponsor,
	isVolunteer,
} from '../common/permissions';

type PermissionsSchema = IRules & {
	Query?: Partial<Record<keyof Query | '*', IRules>>;
	Mutation?: Partial<Record<keyof Mutation | '*', IRules>>;
	User?: Partial<Record<keyof User | '*', IRules>>;
};

const canViewAllHackers = or(isOrganizer, isSponsor, isVolunteer);

const permissions_: PermissionsSchema = {
	Query: {
		// Allow all users to ensure that unauthenticated users don't get permission errors
		loggedInUser: allow,
		// Allow users with the VIEW_ALL_HACKERS role to query arbitrary users and any user to query themself.
		user: or(isQueryingSelf, canViewAllHackers, hasBearerToken),
		// Only allow users with the VIEW_ALL_HACKERS role to query `users`
		users: or(canViewAllHackers, hasBearerToken),
	},
	Mutation: {
		// Primarily issued from the backend to log in a new user
		logInUser: hasBearerToken,
	},
};

export const permissions = shield(permissions_, { fallbackRule: hasBearerToken });
