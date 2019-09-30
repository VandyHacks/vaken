import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import {
	DietaryRestriction,
	UserType,
	Race,
	ShirtSize,
	LoginProvider,
	ApplicationStatus,
	UserDbInterface,
	UserResolvers,
	Resolvers,
	HackerDbObject,
} from '../generated/graphql';
import Context from '../context';
import { fetchUser, query, queryById, toEnum, updateUser, checkIsAuthorized } from './helpers';
import { checkInUserToEvent, removeUserFromEvent, registerNFCUIDWithUser } from '../nfc';
import { getSignedUploadUrl, getSignedReadUrl } from '../storage/gcp';
// import { requiredFields } from '../../client/assets/application';
export const requiredFields = [
	'firstName',
	'lastName',
	'shirtSize',
	'phoneNumber',
	'dateOfBirth',
	'school',
	'major',
	'graduationYear',
	'race',
	'essay1',
	'volunteer',
	'consent',
];
/**
 * Used to define a __resolveType function on the User resolver that doesn't take in a promise. This is important as it
 */
export type CustomResolvers<T> = Omit<Resolvers<T>, 'User'> & {
	User: {
		__resolveType: (user: UserDbInterface) => 'Hacker' | 'Organizer' | 'Mentor';
	};
};

const userResolvers: Omit<UserResolvers, '__resolveType' | 'userType'> = {
	createdAt: async field => (await field).createdAt.getTime(),
	dietaryRestrictions: async user => (await user).dietaryRestrictions,
	email: async user => (await user).email,
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

export const resolvers: CustomResolvers<Context> = {
	/**
	 * These resolvers are for querying fields
	 */
	ApplicationField: {
		answer: async field => (await field).answer || '',
		createdAt: async field => (await field).createdAt.getTime(),
		id: async field => (await field).id,
		question: async field => (await field).question,
		userId: async field => (await field).userId,
	},
	Event: {
		attendees: async event => (await event).attendees || [],
		checkins: async event => (await event).checkins || [],
		description: async event => (await event).description || null,
		duration: async event => (await event).duration,
		eventType: async event => (await event).eventType,
		id: async event => (await event)._id.toHexString(),
		location: async event => (await event).location,
		name: async event => (await event).name,
		startTimestamp: async event => (await event).startTimestamp.getTime(),
		warnRepeatedCheckins: async event => (await event).warnRepeatedCheckins,
	},
	EventCheckIn: {
		id: async eventCheckIn => (await eventCheckIn)._id.toHexString(),
		timestamp: async eventCheckIn => (await eventCheckIn).timestamp.getTime(),
		user: async eventCheckIn => (await eventCheckIn).user,
	},
	Hacker: {
		...userResolvers,
		adult: async hacker => (await hacker).adult || null,
		application: async (hacker, args, { models }: Context) =>
			models.ApplicationFields.find({ userId: (await hacker)._id }).toArray(),
		gender: async hacker => (await hacker).gender || null,
		github: async hacker => (await hacker).github || null,
		gradYear: async hacker => (await hacker).gradYear || null,
		majors: async hacker => (await hacker).majors || [],
		modifiedAt: async hacker => (await hacker).modifiedAt,
		race: async hacker => (await hacker).race || '',
		school: async hacker => (await hacker).school || null,
		status: async hacker => toEnum(ApplicationStatus)((await hacker).status),
		team: async (hacker, args, { models }) => {
			const team = await models.UserTeamIndicies.findOne({ email: (await hacker).email });
			if (!team) return { _id: new ObjectID(), createdAt: new Date(0), memberIds: [], name: '' };
			return query({ name: team.team }, models.Teams);
		},
		userType: () => UserType.Hacker,
		volunteer: async hacker => (await hacker).volunteer || null,
	},
	Login: {
		createdAt: async login => (await login).createdAt.getTime(),
		provider: async login => toEnum(LoginProvider)((await login).provider),
		token: async login => (await login).token,
		userType: async login => (await login).userType as UserType,
	},
	Mentor: {
		...userResolvers,
		createdAt: async mentor => (await mentor).createdAt.getTime(),
		shifts: async mentor => (await mentor).shifts,
		shirtSize: async mentor => {
			const { shirtSize } = await mentor;
			return shirtSize ? toEnum(ShirtSize)(shirtSize) : null;
		},
		skills: async mentor => (await mentor).skills,
		userType: () => UserType.Mentor,
	},
	/**
	 * These mutations modify data
	 * Each may contain authentication checks as well
	 */
	Mutation: {
		checkInUserToEvent: async (root, { input }, { models, user }) => {
			checkIsAuthorized(UserType.Organizer, user);
			const userRet = await checkInUserToEvent(input.user, input.event, models);
			return userRet;
		},
		hackerStatus: async (_, { input: { id, status } }, { user, models }) => {
			checkIsAuthorized(UserType.Organizer, user);
			const { ok, value, lastErrorObject: err } = await models.Hackers.findOneAndUpdate(
				{ _id: ObjectID.createFromHexString(id) },
				{ $set: { status } },
				{ returnOriginal: false }
			);
			if (!ok || !value)
				throw new UserInputError(`user ${id} (${value}) error: ${JSON.stringify(err)}`);
			return value;
		},
		hackerStatuses: async (_, { input: { ids, status } }, { user, models }) => {
			checkIsAuthorized(UserType.Organizer, user);
			const objectIds = ids.map(id => ObjectID.createFromHexString(id));
			const { result } = await models.Hackers.updateMany(
				{ _id: { $in: objectIds } },
				{ $set: { status } }
			);
			if (!result.ok) throw new UserInputError(`!ok updating ${JSON.stringify(ids)}}`);

			return models.Hackers.find({ _id: { $in: objectIds } }).toArray();
		},
		joinTeam: async (root, { input: { name } }, { models, user }) => {
			const hacker = checkIsAuthorized(UserType.Hacker, user);
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
				{ $push: { memberIds: hacker.email } }
			);
			if (!ok) throw new UserInputError(`error adding "${hacker.email}" to team "${name}": ${err}`);
			const result = await models.UserTeamIndicies.findOneAndUpdate(
				{ email: hacker.email },
				{ $set: { email: hacker.email, team: name } },
				{ upsert: true }
			);
			if (!result.ok) {
				throw new UserInputError(
					`error adding "${hacker.email}" to team index "${name}": ${result.lastErrorObject}`
				);
			}

			const ret = await models.Hackers.findOne({ email: hacker.email });
			if (!ret) throw new AuthenticationError(`hacker not found: ${hacker.email}`);
			return ret;
		},
		leaveTeam: async (root, args, { models, user }) => {
			const hacker = checkIsAuthorized(UserType.Hacker, user);
			const { value, ok, lastErrorObject: err } = await models.UserTeamIndicies.findOneAndDelete({
				email: hacker.email,
			});
			if (!value || !ok)
				throw new UserInputError(`error removing user team index: ${JSON.stringify(err)}`);

			const { value: team, ok: okTeam, lastErrorObject: e } = await models.Teams.findOneAndUpdate(
				{ name: value.team },
				{ $pull: { memberIds: hacker.email } },
				{ returnOriginal: false }
			);
			if (!team || !okTeam)
				throw new UserInputError(`error removing user from team: ${JSON.stringify(e)}`);
			if (!team.memberIds.length) models.Teams.findOneAndDelete({ name: value.team });

			const ret = await models.Hackers.findOne({ email: hacker.email });
			if (!ret) throw new AuthenticationError(`hacker not found: ${hacker.email}`);
			return ret;
		},
		registerNFCUIDWithUser: async (root, { input }, { models, user }) => {
			checkIsAuthorized(UserType.Organizer, user);
			const userRet = await registerNFCUIDWithUser(input.nfcid, input.user, models);
			return userRet;
		},
		removeUserFromEvent: async (root, { input }, { models, user }) => {
			checkIsAuthorized(UserType.Organizer, user);
			const userRet = await removeUserFromEvent(input.user, input.event, models);
			return userRet;
		},
		signedUploadUrl: async (_, { input }, { user }) => {
			// Enables a user to update their application
			if (!user) throw new AuthenticationError(`cannot update application: user not logged in`);
			return getSignedUploadUrl(`${user._id}`);
		},
		updateMyApplication: async (root, args, ctx) => {
			// Enables a user to update their application
			if (!ctx.user) throw new AuthenticationError(`cannot update application: user not logged in`);
			// TODO(leonm1): Figure out why the _id field isn't actually an ObjectID
			const id = ObjectID.createFromHexString((ctx.user._id as unknown) as string);
			// update app answers if they exist
			const { result } = await ctx.models.ApplicationFields.bulkWrite(
				args.input.map(({ question, answer }) => ({
					updateOne: {
						filter: { question, userId: id },
						update: { $set: { answer, question, userId: id } },
						upsert: true,
					},
				}))
			);

			// TODO: Update this to set the hacker's profile fields (name, school, gender, etc.) with application data.
			if (!result.ok) {
				throw new UserInputError(
					`error inputting user application input for user "${id}" ${JSON.stringify(result)}`
				);
			}

			const hacker = await ctx.models.Hackers.findOne({ _id: id });
			if (!hacker) throw new AuthenticationError(`hacker not found: ${id.toHexString()}`);

			const appFinished = requiredFields.every(q =>
				args.input.some(answer => answer.question === q)
			);

			// Update the fields of the hacker object with application data.
			// TODO: Improve the quality of this resolver by removing this hack.
			const changedFields = [
				'firstName',
				'preferredName',
				'lastName',
				'shirtSize',
				'gender',
				'dietaryRestrictions',
				'phoneNumber',
				'race',
				'school',
				'gradYear',
				'volunteer',
			].reduce(
				(acc, reqField) => {
					const field = args.input.find(input => input.question === reqField);
					return field ? { ...acc, [reqField]: field.answer } : acc;
				},
				{} as Partial<HackerDbObject> // eslint-disable-line @typescript-eslint/no-object-literal-type-assertion
			);

			const appStatus =
				appFinished &&
				[ApplicationStatus.Started, ApplicationStatus.Verified, ApplicationStatus.Created].includes(
					hacker.status as ApplicationStatus
				)
					? ApplicationStatus.Submitted
					: hacker.status;

			const { value, ok, lastErrorObject } = await ctx.models.Hackers.findOneAndUpdate(
				{ _id: id },
				{ $set: { status: appStatus, ...changedFields } }
			);

			if (!ok || !value) {
				throw new UserInputError(
					`error inputting user status "SUBMITTED" for user "${id}" ${JSON.stringify(
						lastErrorObject
					)}`
				);
			}

			return value;
		},
		updateMyProfile: async (root, { input }, { models, user }) => {
			// Enables a user to update their own profile
			if (!user) throw new AuthenticationError(`cannot update profile: user not logged in`);
			const result = await updateUser(user, input, models);
			if (!result)
				throw new UserInputError(`unable to update profile: "${JSON.stringify(user)}" not found `);
			return result;
		},
		updateProfile: async () => {
			throw new UserInputError('Not implemented :(');
		},
	},
	Organizer: {
		...userResolvers,
		permissions: async organizer => (await organizer).permissions,
		userType: () => UserType.Organizer,
	},
	Query: {
		event: async (root, { id }, ctx) => queryById(id, ctx.models.Events),
		eventCheckIn: async (root, { id }, ctx) => queryById(id, ctx.models.EventCheckIns),
		eventCheckIns: async (root, args, ctx) => ctx.models.EventCheckIns.find().toArray(),
		events: async (root, args, ctx) => ctx.models.Events.find().toArray(),
		hacker: async (root, { id }, ctx) => queryById(id, ctx.models.Hackers),
		hackers: async (root, args, ctx) => ctx.models.Hackers.find().toArray(),
		me: async (root, args, ctx) => {
			if (!ctx.user) throw new AuthenticationError(`user is not logged in`);
			return fetchUser(ctx.user, ctx.models);
		},
		mentor: async (root, { id }, ctx) => queryById(id, ctx.models.Mentors),
		mentors: async (root, args, ctx) => ctx.models.Mentors.find().toArray(),
		organizer: async (root, { id }, ctx) => queryById(id, ctx.models.Organizers),
		organizers: async (root, args, ctx) => ctx.models.Organizers.find().toArray(),
		signedReadUrl: async (_, { input }, { user }) => {
			// Enables a user to update their application
			if (!user) throw new AuthenticationError(`cannot get read url: user not logged in`);

			// No file to get :)
			if (!input) return '';

			// Hackers may get their own files; organizers may get any file
			if (!input.includes((user._id as unknown) as string))
				checkIsAuthorized(UserType.Organizer, user);

			return getSignedReadUrl(input);
		},
		team: async (root, { id }, ctx) => queryById(id, ctx.models.Teams),
		teams: async (root, args, ctx) => ctx.models.Teams.find().toArray(),
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
