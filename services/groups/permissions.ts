import { IRules, rule, shield, or, race, and } from 'graphql-shield';
import { Query, Mutation, Role, User, Group } from './lib/generated.graphql';
import type { GroupsContext } from './index';
import { getGroup } from './lib/query/groups';
import { GATEWAY_BEARER_TOKEN } from '../common/env';

type PermissionsSchema = IRules & {
	Query?: Partial<Record<keyof Query | '*', IRules>>;
	Mutation?: Partial<Record<keyof Mutation | '*', IRules>>;
	User?: Partial<Record<keyof User | '*', IRules>>;
	Group?: Partial<Record<keyof Group | '*', IRules>>;
};

const hasBearerToken = rule('hasBearerToken', { cache: 'contextual' })(
	(_, __, { bearerToken }: GroupsContext) =>
		!!(GATEWAY_BEARER_TOKEN && bearerToken === GATEWAY_BEARER_TOKEN)
);
const hasRole = (role: Role) =>
	rule(`has${role}Role`, { cache: 'contextual' })(
		(_, __, { user }: GroupsContext) => !!user?.roles.includes(role)
	);
const isSponsor = hasRole(Role.Sponsor);
const isOrganizer = hasRole(Role.Organizer);
const isSuperAdmin = hasRole(Role.SuperAdmin);
const isGroupMember = rule('isGroupMember', { cache: 'contextual' })(
	async (_, args: { userId: string; groupId: string }, { user }: GroupsContext) =>
		!!(await getGroup({ id: args.groupId }))?.members?.find(member => member.id === user?.id)
);
const isSelf = rule('isSelf', { cache: 'contextual' })(
	async (_, args: { userId: string }, { user }: GroupsContext) => !!(args.userId === user?.id)
);

const permissions_: PermissionsSchema = {
	Query: {
		// hasBearerToken must be first and this must be a race, otherwise group calls itself recursively
		group: race(hasBearerToken, isOrganizer, isGroupMember),
		groups: or(isOrganizer),
	},
	Mutation: {
		createGroup: isOrganizer,
		setGroupRoles: isSuperAdmin,
		addUserToGroup: or(isOrganizer, and(isSponsor, isGroupMember), and(isSelf, isGroupMember)),
		removeUserFromGroup: or(isOrganizer, and(isSponsor, isGroupMember), and(isSelf, isGroupMember)),
	},
};

export const permissions = shield(permissions_, { fallbackRule: hasBearerToken });
