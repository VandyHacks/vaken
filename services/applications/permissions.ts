import { IRules, shield, or } from 'graphql-shield';
import { Mutation, Application } from './lib/generated.graphql';
import { hasBearerToken, isOrganizer, isVolunteer, isQueryingSelf } from '../common/permissions';

type PermissionsSchema = IRules & {
	Mutation?: Partial<Record<keyof Mutation | '*', IRules>>;
	Application?: Partial<Record<keyof Application | '*', IRules>>;
};

const canEditHackers = or(isOrganizer, isVolunteer);

const permissions_: PermissionsSchema = {
	Mutation: {
		// Primarily issued from the backend to log in a new user
		saveApplication: or(isQueryingSelf, canEditHackers, hasBearerToken),
		setUserApplicationStatus: or(canEditHackers, hasBearerToken),
	},
};

export const permissions = shield(permissions_, { fallbackRule: hasBearerToken });
