import { ObjectID } from 'mongodb';
import { CustomResolvers } from './types';
import Context from '../context';
import { toEnum, query } from './helpers';
import { User } from './UserResolver';
import { ApplicationStatus, UserType } from '../generated/graphql';

export const Hacker: CustomResolvers<Context>['Hacker'] = {
	...User,
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
	eventScore: async hacker => (await hacker).eventScore || 0,
	userType: () => UserType.Hacker,
	volunteer: async hacker => (await hacker).volunteer || null,
};
