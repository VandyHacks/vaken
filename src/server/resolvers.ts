import { UserInputError, AuthenticationError, ApolloError } from 'apollo-server-express';
import { ObjectID, Collection, ObjectId, FilterQuery } from 'mongodb';
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
	UserResolvers,
} from './generated/graphql';
import Context from './context';
import { Models } from './models';

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

async function query<T>(filter: FilterQuery<T>, model: Collection<T>): Promise<T> {
	const obj = await model.findOne(filter);
	if (!obj)
		throw new UserInputError(
			`obj with filters: "${JSON.stringify(filter)}" not found in collection "${
				model.collectionName
			}"`
		);
	return obj;
}

async function queryById<T extends { _id: ObjectId }>(
	id: string,
	model: Collection<T>
): Promise<T> {
	return query<T>({ _id: ObjectID.createFromHexString(id) }, model);
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
	}
	if (user.userType === UserType.Organizer) {
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
	{ email, userType }: { email: string; userType: string },
	models: Models
): Promise<UserDbInterface> {
	if (userType === UserType.Hacker) {
		return query({ email }, models.Hackers);
	}
	if (userType === UserType.Organizer) {
		return query({ email }, models.Organizers);
	}
	throw new ApolloError(`updateUser for userType ${userType} not implemented`);
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

const userResolvers: Required<Omit<UserResolvers, '__resolveType' | 'userType'>> = {
	createdAt: async field => (await field).createdAt.getTime(),
	dietaryRestrictions: async user => {
		const { dietaryRestrictions = [] } = await user;
		return dietaryRestrictions.map(toDietEnum);
	},
	email: async user => (await user).email,
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
		return shirtSize ? toShirtSizeEnum(shirtSize) : null;
	},
};

export const resolvers: Resolvers = {
	/**
	 * These resolvers are for querying fields
	 */
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
		...userResolvers,
		adult: async hacker => (await hacker).adult || null,
		gender: async hacker => (await hacker).gender || null,
		github: async hacker => (await hacker).github || null,
		gradYear: async hacker => (await hacker).gradYear || null,
		majors: async hacker => (await hacker).majors || [],
		modifiedAt: async hacker => (await hacker).modifiedAt,
		race: async hacker => (await hacker).race.map(toRaceEnum) || null,
		school: async hacker => (await hacker).school || null,
		status: async hacker => toApplicationStatusEnum((await hacker).status),
		team: async (hacker, args, { models }: Context) => {
			const team = await models.UserTeamIndicies.findOne({ email: (await hacker).email });
			if (!team) return { _id: new ObjectID(), createdAt: new Date(0), memberIds: [], name: '' };
			return query({ name: team.team }, models.Teams);
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
		...userResolvers,
		createdAt: async mentor => (await mentor).createdAt.getTime(),
		shifts: async mentor => (await mentor).shifts,
		shirtSize: async mentor => {
			const { shirtSize } = await mentor;
			return shirtSize ? toShirtSizeEnum(shirtSize) : null;
		},
		skills: async mentor => (await mentor).skills,
		userType: () => UserType.Mentor,
	},
	/**
	 * These mutations modify data
	 * Each may contain  authentication checks as well
	 */
	Mutation: {
		hackerStatus: async (_, { input: { id, status } }, { user, models }: Context) => {
			if (!user || user.userType !== UserType.Organizer)
				throw new AuthenticationError(`user ${JSON.stringify(user)} must be an organizer`);
			const { ok, value, lastErrorObject: err } = await models.Hackers.findOneAndUpdate(
				{ _id: ObjectID.createFromHexString(id) },
				{ $set: { status } },
				{ returnOriginal: false }
			);
			if (!ok || err || !value)
				throw new UserInputError(`user ${id} (${value}) error: ${JSON.stringify(err)}`);
			return value;
		},
		hackerStatuses: async (_, { input: { ids, status } }, { user, models }: Context) => {
			if (!user || user.userType !== UserType.Organizer)
				throw new AuthenticationError(`user ${JSON.stringify(user)} must be an organizer`);
			const objectIds = ids.map(id => ObjectID.createFromHexString(id));
			const { result } = await models.Hackers.updateMany(
				{ _id: { $in: objectIds } },
				{ $set: { status } }
			);
			if (!result.ok) throw new UserInputError(`!ok updating ${JSON.stringify(ids)}}`);

			return models.Hackers.find({ _id: { $in: objectIds } }).toArray();
		},
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
		...userResolvers,
		permissions: async organizer => (await organizer).permissions,
		userType: () => UserType.Organizer,
	},
	Query: {
		hacker: async (root, { id }, ctx: Context) => queryById(id, ctx.models.Hackers),
		hackers: async (root, args, ctx: Context) => ctx.models.Hackers.find().toArray(),
		me: async (root, args, ctx: Context) => {
			if (!ctx.user) throw new AuthenticationError(`user is not logged in`);
			return fetchUser(ctx.user, ctx.models);
		},
		mentor: async (root, { id }, ctx: Context) => queryById(id, ctx.models.Mentors),
		mentors: async (root, args, ctx: Context) => ctx.models.Mentors.find().toArray(),
		organizer: async (root, { id }, ctx: Context) => queryById(id, ctx.models.Organizers),
		organizers: async (root, args, ctx: Context) => ctx.models.Organizers.find().toArray(),
		team: async (root, { id }, ctx: Context) => queryById(id, ctx.models.Teams),
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
