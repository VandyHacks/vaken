import { UserInputError, AuthenticationError } from 'apollo-server-koa';
import {
	ApplicationFieldResolvers,
	ApplicationQuestionResolvers,
	HackerResolvers,
	LoginResolvers,
	MentorResolvers,
	OrganizerResolvers,
	QueryResolvers,
	ShiftResolvers,
	TeamResolvers,
	DietaryRestriction,
	UserType,
	Race,
	ShirtSize,
	LoginProvider,
	ApplicationStatus,
} from './generated/graphql';
import Context from './context';

function toDietEnum(restriction: string): DietaryRestriction {
	if (!Object.values(DietaryRestriction).includes(restriction))
		throw new UserInputError(`Invalid dietary restriction ${restriction}`);
	return restriction as DietaryRestriction;
}

function toRaceEnum(race: string): Race {
	if (!Object.values(Race).includes(race)) throw new UserInputError(`Invalid race ${race}`);
	return race as Race;
}

function toShirtSizeEnum(size: string): ShirtSize {
	if (!Object.values(ShirtSize).includes(size))
		throw new UserInputError(`Invalid shirt size: ${size}`);
	return size as ShirtSize;
}

function toLoginProviderEnum(input: string): LoginProvider {
	if (!Object.values(LoginProvider).includes(input))
		throw new UserInputError(`Invalid login provider: ${input}`);
	return input as LoginProvider;
}

function toApplicationStatusEnum(status: string): ApplicationStatus {
	if (!Object.values(ApplicationStatus).includes(status))
		throw new UserInputError(`Invalid application status: ${status}`);
	return status as ApplicationStatus;
}

export interface Resolvers {
	ApplicationField: ApplicationFieldResolvers;
	ApplicationQuestion: ApplicationQuestionResolvers;
	Hacker: HackerResolvers;
	Login: LoginResolvers;
	Mentor: MentorResolvers;
	Organizer: OrganizerResolvers;
	Query: QueryResolvers;
	Shift: ShiftResolvers;
	Team: TeamResolvers;
}

export const resolvers: Resolvers = {
	ApplicationField: {
		answer: async field => (await field).answer || null,
		createdAt: async field => (await field).createdAt.getTime(),
		id: async field => (await field).id,
		question: async field => (await field).question,
	},
	ApplicationQuestion: {
		instruction: async question => (await question).instruction || null,
		note: async question => (await question).note || null,
		prompt: async question => (await question).prompt,
	},
	Hacker: {
		adult: async hacker => (await hacker).adult || null,
		createdAt: async hacker => (await hacker).createdAt.getTime(),
		dietaryRestrictions: async hacker => (await hacker).dietaryRestrictions.map(toDietEnum),
		email: async hacker => (await hacker).email,
		firstName: async hacker => (await hacker).firstName,
		gender: async hacker => (await hacker).gender || null,
		github: async hacker => (await hacker).github || null,
		gradYear: async hacker => (await hacker).gradYear || null,
		id: async hacker => (await hacker)._id.toHexString(),
		lastName: async hacker => (await hacker).lastName,
		logins: async hacker => (await hacker).logins || null,
		majors: async hacker => (await hacker).majors || [],
		modifiedAt: async hacker => (await hacker).modifiedAt,
		preferredName: async hacker => (await hacker).preferredName,
		race: async hacker => (await hacker).race.map(toRaceEnum) || null,
		school: async hacker => (await hacker).school || null,
		secondaryIds: async hacker => (await hacker).secondaryIds,
		shirtSize: async hacker => {
			const { shirtSize } = await hacker;
			return shirtSize ? toShirtSizeEnum(shirtSize) : null;
		},
		status: async hacker => toApplicationStatusEnum((await hacker).status),
		team: async hacker => (await hacker).team || null,
		userType: () => UserType.Hacker,
		volunteer: async hacker => (await hacker).volunteer || null,
	},
	Login: {
		createdAt: async login => (await login).createdAt.getTime(),
		provider: async login => toLoginProviderEnum((await login).provider),
		token: async login => (await login).token,
	},
	Mentor: {
		createdAt: async mentor => (await mentor).createdAt.getTime(),
		dietaryRestrictions: async mentor => (await mentor).dietaryRestrictions.map(toDietEnum),
		email: async mentor => (await mentor).email,
		firstName: async mentor => (await mentor).firstName,
		gender: async mentor => (await mentor).gender || null,
		id: async mentor => (await mentor)._id.toHexString(),
		lastName: async mentor => (await mentor).lastName,
		logins: async mentor => (await mentor).logins || null,
		preferredName: async mentor => (await mentor).preferredName,
		race: async mentor => (await mentor).race.map(toRaceEnum) || null,
		secondaryIds: async mentor => (await mentor).secondaryIds,
		shifts: async mentor => (await mentor).shifts,
		shirtSize: async mentor => {
			const { shirtSize } = await mentor;
			return shirtSize ? toShirtSizeEnum(shirtSize) : null;
		},
		skills: async mentor => (await mentor).skills,
		userType: () => UserType.Mentor,
	},
	Organizer: {
		createdAt: async organizer => (await organizer).createdAt.getTime(),
		dietaryRestrictions: async organizer => (await organizer).dietaryRestrictions.map(toDietEnum),
		email: async organizer => (await organizer).email,
		firstName: async organizer => (await organizer).firstName,
		gender: async organizer => (await organizer).gender || null,
		id: async organizer => (await organizer)._id.toHexString(),
		lastName: async organizer => (await organizer).lastName,
		logins: async organizer => (await organizer).logins || null,
		permissions: async organizer => (await organizer).permissions,
		preferredName: async organizer => (await organizer).preferredName,
		race: async organizer => (await organizer).race.map(toRaceEnum) || null,
		secondaryIds: async organizer => (await organizer).secondaryIds,
		shirtSize: async organizer => {
			const { shirtSize } = await organizer;
			return shirtSize ? toShirtSizeEnum(shirtSize) : null;
		},
		userType: () => UserType.Organizer,
	},
	Query: {
		hacker: async (root, { id }, ctx: Context) => {
			const hacker = await ctx.models.Hackers.findOne({ _id: id });
			if (!hacker) throw new UserInputError(`hacker with id: ${id} not found`);
			return hacker;
		},
		hackers: async (root, args, ctx: Context) => ctx.models.Hackers.find().toArray(),
		me: (root, args, ctx: Context) => {
			if (!ctx.user) throw new AuthenticationError(`user is not logged in`);
			return ctx.user;
		},
		mentor: async (root, { id }, ctx: Context) => {
			const mentor = await ctx.models.Mentors.findOne({ _id: id });
			if (!mentor) throw new UserInputError(`mentor with id: ${id} not found`);
			return mentor;
		},
		mentors: async (root, args, ctx: Context) => ctx.models.Mentors.find().toArray(),
		organizer: async (root, { id }, ctx: Context) => {
			const organizer = await ctx.models.Organizers.findOne({ _id: id });
			if (!organizer) throw new UserInputError(`organizer with id: ${id} not found`);
			return organizer;
		},
		organizers: async (root, args, ctx: Context) => ctx.models.Organizers.find().toArray(),
		team: async (root, { id }, ctx: Context) => {
			const team = await ctx.models.Teams.findOne({ _id: id });
			if (!team) throw new UserInputError(`team with id: ${id} not found`);
			return team;
		},
		teams: async (root, args, ctx: Context) => ctx.models.Teams.find().toArray(),
	},
	Shift: {
		begin: async shift => (await shift).begin.getTime(),
		end: async shift => (await shift).end.getTime(),
	},
	Team: {
		createdAt: async team => (await team).createdAt.getTime(),
		id: async team => (await team)._id.toHexString(),
		memberIds: async team => (await team).memberIds,
		name: async team => (await team).name || null,
		size: async team => (await team).memberIds.length,
	},
};

export default resolvers;
