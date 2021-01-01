import Context from '../context';
import { MentorResolvers, UserType, ShirtSize } from '../generated/graphql';
import { User } from './UserResolver';
import { toEnum } from './helpers';

export const Mentor: MentorResolvers<Context> = {
	...User,
	createdAt: async mentor => (await mentor).createdAt.getTime(),
	shifts: async mentor => (await mentor).shifts,
	shirtSize: async mentor => {
		const { shirtSize } = await mentor;
		return shirtSize ? toEnum(ShirtSize)(shirtSize) : null;
	},
	skills: async mentor => (await mentor).skills,
	userType: () => UserType.Mentor,
};
