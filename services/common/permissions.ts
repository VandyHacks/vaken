import { Role } from '../../common/types/generated';
import { rule } from 'graphql-shield';
import { CommonContext } from './client';
import { GATEWAY_BEARER_TOKEN } from './env';

export const hasBearerToken = rule('hasBearerToken', { cache: 'contextual' })(
	(_, __, { bearerToken }: CommonContext) =>
		!!(GATEWAY_BEARER_TOKEN && bearerToken === GATEWAY_BEARER_TOKEN)
);

const hasRole = (role: Role) =>
	rule(`has${role[0]}${role.substring(1).toLowerCase()}Role`, { cache: 'contextual' })(
		(_, __, { user }: CommonContext) => !!user?.roles.includes(role)
	);
export const isSponsor = hasRole(Role.Sponsor);
export const isOrganizer = hasRole(Role.Organizer);
export const isSuperAdmin = hasRole(Role.SuperAdmin);
export const isVolunteer = hasRole(Role.Volunteer);

export const isQueryingSelf = rule('isQueryingSelf', { cache: 'contextual' })(
	(_, args: { userId?: string | string[] }, { user }: CommonContext) =>
		!!(
			args.userId &&
			user?.id &&
			(args.userId === user.id ||
				(args.userId instanceof Array && args.userId.every(id => id === user.id)))
		)
);
