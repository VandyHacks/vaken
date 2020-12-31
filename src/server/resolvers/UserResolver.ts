import { UserResolvers, ShirtSize } from '../generated/graphql';
import { toEnum } from './helpers';

export const User: Omit<UserResolvers, '__resolveType' | 'userType'> = {
	createdAt: async field => (await field).createdAt.getTime(),
	// TODO: Add input validation for dietaryRestrictions. toEnum(DietaryRestriction)()
	dietaryRestrictions: async user => (await user).dietaryRestrictions,
	email: async user => (await user).email,
	emailUnsubscribed: async hacker => (await hacker).emailUnsubscribed || false,
	eventsAttended: async user => (await user).eventsAttended || null,
	firstName: async user => (await user).firstName,
	gender: async user => (await user).gender || null,
	id: async user => (await user)._id.toHexString(),
	lastName: async user => (await user).lastName,
	logins: async user => (await user).logins || null,
	phoneNumber: async user => (await user).phoneNumber || null,
	preferredName: async user => (await user).preferredName,
	secondaryIds: async user => (await user).secondaryIds,
	shirtSize: async user => {
		const { shirtSize } = await user;
		return shirtSize ? toEnum(ShirtSize)(shirtSize) : null;
	},
};
