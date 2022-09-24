import { allow, IRules, rule, shield, or } from 'graphql-shield';
import { Query, Mutation, Role, User } from './lib/generated.graphql';
import type { UsersContext } from './index';

type PermissionsSchema = IRules & {
	Query?: Partial<Record<keyof Query | '*', IRules>>;
	Mutation?: Partial<Record<keyof Mutation | '*', IRules>>;
	User?: Partial<Record<keyof User | '*', IRules>>;
};

const { GATEWAY_BEARER_TOKEN } = process.env;
if (!GATEWAY_BEARER_TOKEN) {
	console.warn(
		'GATEWAY_BEARER_TOKEN not set. Bearer token auth will be disabled. This ' +
			'will adversely affect the logInUser mutation.'
	);
}

const hasBearerToken = rule('hasBearerToken', { cache: 'contextual' })(
	(_, __, { bearerToken }: UsersContext) =>
		!!(GATEWAY_BEARER_TOKEN && bearerToken === GATEWAY_BEARER_TOKEN)
);
const canViewAllHackers = rule('canViewAllHackers', { cache: 'contextual' })(
	(_, __, { user }: UsersContext) =>
		!!user?.roles.includes(Role.Organizer) ||
		!!user?.roles.includes(Role.Sponsor) ||
		!!user?.roles.includes(Role.Volunteer)
);
const isQueryingSelf = rule('isQueryingSelf', { cache: 'contextual' })(
	(_, args: { id?: string }, { user }: UsersContext) => args.id === user?.id
);

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
