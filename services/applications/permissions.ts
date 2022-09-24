import { deny, IRules, rule, shield, or } from 'graphql-shield';
import { Mutation, Application } from './lib/generated.graphql';
import { Role } from '../../common/types/generated';
import type { ApplicationsContext } from './index';

type PermissionsSchema = IRules & {
	Mutation?: Partial<Record<keyof Mutation | '*', IRules>>;
	Application?: Partial<Record<keyof Application | '*', IRules>>;
};

const { GATEWAY_BEARER_TOKEN } = process.env;
if (!GATEWAY_BEARER_TOKEN) {
	console.warn(
		'GATEWAY_BEARER_TOKEN not set. Bearer token auth will be disabled. This ' +
			'will adversely affect the logInUser mutation.'
	);
}

const hasBearerToken = rule('hasBearerToken', { cache: 'contextual' })(
	(_, __, { bearerToken }: ApplicationsContext) =>
		!!(GATEWAY_BEARER_TOKEN && bearerToken === GATEWAY_BEARER_TOKEN)
);
const canEditHackers = rule('canEditHackers', { cache: 'contextual' })(
	(_, __, { user }: ApplicationsContext) =>
		!!user?.roles.includes(Role.Organizer) || !!user?.roles.includes(Role.Volunteer)
);
const isQueryingSelf = rule('isQueryingSelf', { cache: 'contextual' })(
	(_, args: { userId?: string | string[] }, { user }: ApplicationsContext) =>
		!!(
			args.userId &&
			user?.id &&
			(args.userId === user.id ||
				(args.userId instanceof Array && args.userId.every(id => id === user.id)))
		)
);

const permissions_: PermissionsSchema = {
	Mutation: {
		// Primarily issued from the backend to log in a new user
		saveApplication: or(isQueryingSelf, canEditHackers, hasBearerToken),
		setUserApplicationStatus: or(canEditHackers, hasBearerToken),
	},
};

export const permissions = shield(permissions_, { fallbackRule: hasBearerToken });
