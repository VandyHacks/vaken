import { IRules, rule, shield, or, race, and } from 'graphql-shield';
import { Query, Mutation, User, Group } from './lib/generated.graphql';
import type { GroupsContext } from './index';
import { getGroup } from './lib/query/groups';
import {
	isOrganizer,
	isSponsor,
	isSuperAdmin,
	hasBearerToken,
	isQueryingSelf,
} from '../common/permissions';

type PermissionsSchema = IRules & {
	Query?: Partial<Record<keyof Query | '*', IRules>>;
	Mutation?: Partial<Record<keyof Mutation | '*', IRules>>;
	User?: Partial<Record<keyof User | '*', IRules>>;
	Group?: Partial<Record<keyof Group | '*', IRules>>;
};

const isGroupMember = rule('isGroupMember', { cache: 'contextual' })(
	async (_, args: { userId: string; groupId: string }, { user }: GroupsContext) =>
		!!(await getGroup({ id: args.groupId }))?.members?.find(member => member.id === user?.id)
);
const isChangingOwnGroupMembership = and(isGroupMember, isQueryingSelf);

const permissions_: PermissionsSchema = {
	Query: {
		// hasBearerToken must be first and this must be a race, otherwise group calls itself recursively
		group: race(hasBearerToken, isOrganizer, isGroupMember),
		groups: or(isOrganizer),
	},
	Mutation: {
		createGroup: isOrganizer,
		setGroupRoles: isSuperAdmin,
		addUserToGroup: or(isOrganizer, and(isSponsor, isGroupMember), isChangingOwnGroupMembership),
		removeUserFromGroup: or(
			isOrganizer,
			and(isSponsor, isGroupMember),
			isChangingOwnGroupMembership
		),
	},
};

export const permissions = shield(permissions_, { fallbackRule: hasBearerToken });
