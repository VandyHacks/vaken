import { UserInputError, AuthenticationError, ApolloError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
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
	UserDbInterface,
	MutationResolvers,
	UserInput,
	Gender,
} from './generated/graphql';
import Context from './context';
import { Models } from './models';
import User from '../common/models/User';

function toDietEnum(restriction: string): DietaryRestriction {
	if (!Object.values(DietaryRestriction).includes(restriction))
		throw new UserInputError(`Invalid dietary restriction ${restriction}`);
	return restriction as DietaryRestriction;
}

function toRaceEnum(race: string): Race {
	if (!Object.values(Race).includes(race)) throw new UserInputError(`Invalid race ${race}`);
	return race as Race;
}

function toGenderEnum(gender: string): Gender {
	if (!Object.values(Gender).includes(gender)) throw new UserInputError(`Invalid gender ${gender}`);
	return gender as Gender;
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

async function updateUser(
	user: { email: string; userType: string },
	args: UserInput,
	models: Models
): Promise<UserDbInterface> {
	const newValues = {
		...args,
		dietaryRestrictions: args.dietaryRestrictions
			? args.dietaryRestrictions.split('|').map(toDietEnum)
			: [],
		gender: args.gender ? toGenderEnum(args.gender) : '',
		modifiedAt: new Date().getTime(),
		shirtSize: args.shirtSize ? toShirtSizeEnum(args.shirtSize) : '',
	};

	if (user.userType === UserType.Hacker) {
		const { value } = await models.Hackers.findOneAndUpdate(
			{ email: user.email },
			{ $set: newValues },
			{ returnOriginal: false }
		);
		if (!value) throw new UserInputError(`user ${user.email} not found`);
		return value;
	} else if (user.userType === UserType.Organizer) {
		const { value } = await models.Organizers.findOneAndUpdate(
			{ email: user.email },
			{ $set: newValues },
			{ returnOriginal: false }
		);
		if (!value) throw new UserInputError(`user ${user.email} not found`);
		return value;
	}
	throw new ApolloError(`updateUser for userType ${user.userType} not implemented`);
}

async function fetchUser(
	user: { email: string; userType: string },
	models: Models
): Promise<UserDbInterface> {
	if (user.userType === UserType.Hacker) {
		const hacker = await models.Hackers.findOne({ email: user.email });
		if (!hacker) throw new UserInputError(`hacker "${user.email}" not found`);
		return hacker;
	} else if (user.userType === UserType.Organizer) {
		const organizer = await models.Organizers.findOne({ email: user.email });
		if (!organizer) throw new UserInputError(`user ${user.email} not found`);
		return organizer;
	}
	throw new ApolloError(`updateUser for userType ${user.userType} not implemented`);
}

export interface Resolvers {
	ApplicationField: Required<ApplicationFieldResolvers>;
	ApplicationQuestion: Required<ApplicationQuestionResolvers>;
	Hacker: Required<HackerResolvers>;
	Login: Required<LoginResolvers>;
	Mentor: Required<MentorResolvers>;
	Mutation: Required<MutationResolvers>;
	Organizer: Required<OrganizerResolvers>;
	Query: Required<QueryResolvers>;
	Shift: Required<ShiftResolvers>;
	Team: Required<TeamResolvers>;
	User: {
		__resolveType: (user: UserDbInterface) => 'Hacker' | 'Organizer' | 'Mentor';
	};
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
		dietaryRestrictions: async hacker => {
			const { dietaryRestrictions = [] } = await hacker;
			return dietaryRestrictions.map(toDietEnum);
		},
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
		phoneNumber: async hacker => (await hacker).phoneNumber || null,
		preferredName: async hacker => (await hacker).preferredName,
		race: async hacker => (await hacker).race.map(toRaceEnum) || null,
		school: async hacker => (await hacker).school || null,
		secondaryIds: async hacker => (await hacker).secondaryIds,
		shirtSize: async hacker => {
			const { shirtSize } = await hacker;
			return shirtSize ? toShirtSizeEnum(shirtSize) : null;
		},
		status: async hacker => toApplicationStatusEnum((await hacker).status),
		team: async (hacker, args, { models }: Context) => {
			const team = await models.UserTeamIndicies.findOne({ email: (await hacker).email });
			if (!team) return { _id: new ObjectID(), createdAt: new Date(0), memberIds: [], name: '' };
			const result = await models.Teams.findOne({ name: team.team });
			if (!result) throw new UserInputError(`error getting team for ${(await hacker).email}`);
			return result;
		},
		userType: () => UserType.Hacker,
		volunteer: async hacker => (await hacker).volunteer || null,
	},
	Login: {
		createdAt: async login => (await login).createdAt.getTime(),
		provider: async login => toLoginProviderEnum((await login).provider),
		token: async login => (await login).token,
		userType: async login => (await login).userType as UserType,
	},
	Mentor: {
		createdAt: async mentor => (await mentor).createdAt.getTime(),
		dietaryRestrictions: async mentor => {
			const { dietaryRestrictions = [] } = await mentor;
			return dietaryRestrictions.map(toDietEnum);
		},
		email: async mentor => (await mentor).email,
		firstName: async mentor => (await mentor).firstName,
		gender: async mentor => (await mentor).gender || null,
		id: async mentor => (await mentor)._id.toHexString(),
		lastName: async mentor => (await mentor).lastName,
		logins: async mentor => (await mentor).logins || null,
		phoneNumber: async mentor => (await mentor).phoneNumber || null,
		preferredName: async mentor => (await mentor).preferredName,
		secondaryIds: async mentor => (await mentor).secondaryIds,
		shifts: async mentor => (await mentor).shifts,
		shirtSize: async mentor => {
			const { shirtSize } = await mentor;
			return shirtSize ? toShirtSizeEnum(shirtSize) : null;
		},
		skills: async mentor => (await mentor).skills,
		userType: () => UserType.Mentor,
	},
	Mutation: {
		joinTeam: async (root, { input: { name } }, { models, user }: Context) => {
			if (!user || user.userType !== UserType.Hacker)
				throw new AuthenticationError(`user "${JSON.stringify(user)}" must be hacker`);
			const team = await models.Teams.findOne({ name });
			if (!team) {
				await models.Teams.insertOne({
					_id: new ObjectID(),
					createdAt: new Date(),
					memberIds: [],
					name,
				});
			}
			const { ok, lastErrorObject: err } = await models.Teams.findOneAndUpdate(
				{ name },
				{ $push: { memberIds: user.email } }
			);
			if (!ok) throw new UserInputError(`error adding "${user.email}" to team "${name}": ${err}`);
			const result = await models.UserTeamIndicies.findOneAndUpdate(
				{ email: user.email },
				{ $set: { email: user.email, team: name } },
				{ upsert: true }
			);
			if (!result.ok) {
				throw new UserInputError(
					`error adding "${user.email}" to team index "${name}": ${result.lastErrorObject}`
				);
			}

			const ret = await models.Hackers.findOne({ email: user.email });
			if (!ret) throw new AuthenticationError(`hacker not found: ${user.email}`);
			return ret;
		},
		leaveTeam: async (root, args, { models, user }: Context) => {
			if (!user || user.userType !== UserType.Hacker)
				throw new AuthenticationError(`user "${JSON.stringify(user)}" must be hacker`);
			const { value, ok, lastErrorObject: err } = await models.UserTeamIndicies.findOneAndDelete({
				email: user.email,
			});
			if (!value || !ok)
				throw new UserInputError(`error removing user team index: ${JSON.stringify(err)}`);

			const { value: team, ok: okTeam, lastErrorObject: e } = await models.Teams.findOneAndUpdate(
				{ name: value.team },
				{ $pull: { memberIds: user.email } },
				{ returnOriginal: false }
			);
			if (!team || !okTeam)
				throw new UserInputError(`error removing user from team: ${JSON.stringify(e)}`);
			if (!team.memberIds.length) models.Teams.findOneAndDelete({ name: value.team });

			const ret = await models.Hackers.findOne({ email: user.email });
			if (!ret) throw new AuthenticationError(`hacker not found: ${user.email}`);
			return ret;
		},
		updateMyProfile: async (root, args, ctx: Context) => {
			// Enables a user to update their own profile
			if (!ctx.user) throw new AuthenticationError(`cannot update profile: user not logged in`);
			const result = await updateUser(ctx.user, args.input, ctx.models);
			if (!result)
				throw new UserInputError(
					`unable to update profile: "${JSON.stringify(ctx.user)}" not found `
				);
			return result;
		},
		updateProfile: async (root, args, ctx: Context) => {
			// TODO: fix this
			// This should enable admins to change profile of other users
			if (!ctx.user) throw new AuthenticationError(`cannot update profile: user not logged in`);
			const result = await updateUser(ctx.user, args.input, ctx.models);
			if (!result)
				throw new UserInputError(
					`unable to update profile: "${JSON.stringify(ctx.user)}" not found `
				);
			return result;
		},
	},
	Organizer: {
		createdAt: async organizer => (await organizer).createdAt.getTime(),
		dietaryRestrictions: async organizer => {
			const { dietaryRestrictions = [] } = await organizer;
			return dietaryRestrictions.map(toDietEnum);
		},
		email: async organizer => (await organizer).email,
		firstName: async organizer => (await organizer).firstName,
		gender: async organizer => (await organizer).gender || null,
		id: async organizer => (await organizer)._id.toHexString(),
		lastName: async organizer => (await organizer).lastName,
		logins: async organizer => (await organizer).logins || null,
		permissions: async organizer => (await organizer).permissions,
		phoneNumber: async organizer => (await organizer).phoneNumber || null,
		preferredName: async organizer => (await organizer).preferredName,
		secondaryIds: async organizer => (await organizer).secondaryIds,
		shirtSize: async organizer => {
			const { shirtSize } = await organizer;
			return shirtSize ? toShirtSizeEnum(shirtSize) : null;
		},
		userType: () => UserType.Organizer,
	},
	Query: {
		hacker: async (root, { id }, ctx: Context) => {
			const hacker = await ctx.models.Hackers.findOne({
				_id: ObjectID.createFromHexString(id),
			});
			if (!hacker) throw new UserInputError(`hacker with id: ${id} not found`);
			return hacker;
		},
		hackers: async (root, args, ctx: Context) => ctx.models.Hackers.find().toArray(),
		me: async (root, args, ctx: Context) => {
			if (!ctx.user) throw new AuthenticationError(`user is not logged in`);
			return fetchUser(ctx.user, ctx.models);
		},
		mentor: async (root, { id }, ctx: Context) => {
			const mentor = await ctx.models.Mentors.findOne({ _id: ObjectID.createFromHexString(id) });
			if (!mentor) throw new UserInputError(`mentor with id: ${id} not found`);
			return mentor;
		},
		mentors: async (root, args, ctx: Context) => ctx.models.Mentors.find().toArray(),
		organizer: async (root, { id }, ctx: Context) => {
			const organizer = await ctx.models.Organizers.findOne({
				_id: ObjectID.createFromHexString(id),
			});
			if (!organizer) throw new UserInputError(`organizer with id: ${id} not found`);
			return organizer;
		},
		organizers: async (root, args, ctx: Context) => ctx.models.Organizers.find().toArray(),
		team: async (root, { id }, ctx: Context) => {
			const team = await ctx.models.Teams.findOne({ _id: ObjectID.createFromHexString(id) });
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
	User: {
		__resolveType: user => {
			switch (user.userType) {
				case UserType.Hacker:
					return 'Hacker';
				case UserType.Organizer:
					return 'Organizer';
				default:
					throw new AuthenticationError(`cannot decode UserType "${user.userType}`);
			}
		},
	},
};

export default resolvers;
