import { IRules, shield, or } from 'graphql-shield';
import { Mutation, Application } from './lib/generated.graphql';
import { isOrganizer, isSponsor, hasBearerToken, isQueryingSelf } from '../common/permissions';

type PermissionsSchema = IRules & {
	Mutation?: Partial<Record<keyof Mutation | '*', IRules>>;
	Application?: Partial<Record<keyof Application | '*', IRules>>;
};

const permissions_: PermissionsSchema = {
	Mutation: {
		fileUploadUrl: or(isQueryingSelf, hasBearerToken),
		resumeDumpUrl: or(isOrganizer, isSponsor, hasBearerToken),
	},
};

export const permissions = shield(permissions_, { fallbackRule: hasBearerToken });
