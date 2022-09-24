import { IRules, rule, shield, or } from 'graphql-shield';
import { Mutation, Application } from './lib/generated.graphql';
import type { ResumesContext } from './index';
import { Role } from '../../common/types/generated';

type PermissionsSchema = IRules & {
	Mutation?: Partial<Record<keyof Mutation | '*', IRules>>;
	Application?: Partial<Record<keyof Application | '*', IRules>>;
};

const { GATEWAY_BEARER_TOKEN } = process.env;

const hasBearerToken = rule('hasBearerToken', { cache: 'contextual' })(
	(_, __, { bearerToken }: ResumesContext) =>
		!!(GATEWAY_BEARER_TOKEN && bearerToken === GATEWAY_BEARER_TOKEN)
);
const isQueryingSelf = rule('isQueryingSelf', { cache: 'contextual' })(
	(_, args: { userId?: string }, { user }: ResumesContext) =>
		!!(args.userId && args.userId === user?.id)
);
const isOrganizer = rule('isOrganizer', { cache: 'contextual' })(
	(_, __, { user }: ResumesContext) => !!user?.roles.includes(Role.Organizer)
);
const isSponsor = rule('isSponsor', { cache: 'contextual' })(
	(_, __, { user }: ResumesContext) => !!user?.roles.includes(Role.Sponsor)
);

const permissions_: PermissionsSchema = {
	Mutation: {
		fileUploadUrl: or(isQueryingSelf, hasBearerToken),
		resumeDumpUrl: or(isOrganizer, isSponsor, hasBearerToken),
	},
};

export const permissions = shield(permissions_, { fallbackRule: hasBearerToken });
