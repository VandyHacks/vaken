import { UserInputError, AuthenticationError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import Context from '../../context';
import {
	MutationResolvers,
	UserType,
	ApplicationStatus,
	SponsorStatus,
	SponsorDbObject,
	TierDbObject,
	CompanyDbObject,
} from '../../generated/graphql';
import { checkIsAuthorized, updateUser } from '../helpers';

import { getSignedUploadUrl } from '../../storage/gcp';
import { sendStatusEmail } from '../../mail/aws';
import logger from '../../logger';
import { EventMutation } from './EventMutationResolvers';
import { updateMyApplication } from './updateApplicationResolver';
import { SpotMutation } from './SpotMutationResolvers';

/**
 * These mutations modify data
 * Each may contain authentication checks as well
 */
export const Mutation: MutationResolvers<Context> = {
	...EventMutation,
	createSponsor: async (
		root,
		{ input: { email, name, companyId } },
		{ models, user }: Context
	): Promise<SponsorDbObject> => {
		checkIsAuthorized(UserType.Organizer, user);
		const company = await models.Companies.findOne({ _id: new ObjectID(companyId) });
		if (!company) throw new UserInputError(`Company with '${companyId}' doesn't exist.`);
		const sponsor = await models.Sponsors.findOne({ email });
		if (sponsor) throw new UserInputError(`sponsor with '${email}' is already added.`);

		const newSponsor: SponsorDbObject = {
			_id: new ObjectID(),
			company,
			createdAt: new Date(),
			email,
			firstName: name,
			lastName: '',
			logins: [],
			phoneNumber: '',
			dietaryRestrictions: '',
			emailUnsubscribed: false,
			eventsAttended: [],
			preferredName: '',
			secondaryIds: [],
			status: SponsorStatus.Added,
			userType: UserType.Sponsor,
		};
		logger.info(`creating new sponsor ${JSON.stringify(newSponsor)}`);
		await models.Sponsors.insertOne(newSponsor);
		return newSponsor;
	},
	...SpotMutation,
	createTier: async (
		root,
		{ input: { name, permissions } },
		{ models, user }: Context
	): Promise<TierDbObject> => {
		checkIsAuthorized(UserType.Organizer, user);
		const tier = await models.Tiers.findOne({ name });
		// currently does not support updating
		if (tier) throw new UserInputError(`Tier ${name} already exists, no action performed.`);

		const newTier: TierDbObject = {
			_id: new ObjectID(),
			name,
			permissions: permissions || [],
		};
		logger.info(`creating tier ${JSON.stringify(newTier)}`);
		await models.Tiers.insertOne(newTier);
		return newTier;
	},
	createCompany: async (
		root,
		{ input: { name, tierId } },
		{ models, user }: Context
	): Promise<CompanyDbObject> => {
		checkIsAuthorized(UserType.Organizer, user);
		const tier = await models.Tiers.findOne({ _id: new ObjectID(tierId) });
		if (!tier) throw new UserInputError(`Tier with id ${tierId}' doesn't exist.`);
		// currently does not support updating
		const comp = await models.Companies.findOne({ name });
		if (comp) throw new UserInputError(`Company ${name} already exists, no action performed.`);

		const newCompany: CompanyDbObject = {
			_id: new ObjectID(),
			name,
			tier,
			eventsOwned: [],
		};
		logger.info(`creating company ${JSON.stringify(newCompany)}`);
		await models.Companies.insertOne(newCompany);
		return newCompany;
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

		if (status === ApplicationStatus.Accepted) sendStatusEmail(value, ApplicationStatus.Accepted);
		else if (status === ApplicationStatus.Rejected)
			sendStatusEmail(value, ApplicationStatus.Rejected);

		return value;
	},
	hackerStatuses: async (_, { input: { ids, status } }, { user, models }) => {
		checkIsAuthorized(UserType.Organizer, user);
		const objectIds = ids.map(id => ObjectID.createFromHexString(id));
		const { result } = await models.Hackers.updateMany(
			{ _id: { $in: objectIds } },
			{ $set: { status } }
		);

		if (!result.ok)
			throw new UserInputError(`Error updating hacker statuses for: ${JSON.stringify(ids)}}`);

		const updatedHackers = await models.Hackers.find({ _id: { $in: objectIds } }).toArray();

		// AWS Docs say to do each mail request synchronously instead of in bulk.
		if (status === ApplicationStatus.Accepted)
			updatedHackers.forEach(hacker => sendStatusEmail(hacker, ApplicationStatus.Accepted));

		return updatedHackers;
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
	signedUploadUrl: async (_, _2, { user }) => {
		if (!user) throw new AuthenticationError(`cannot get signed upload url: user not logged in`);
		return getSignedUploadUrl(`${user._id}`);
	},

	sponsorStatus: async (_, { input: { email, status } }, { models }: Context) => {
		const { ok, value, lastErrorObject: err } = await models.Sponsors.findOneAndUpdate(
			{ email },
			{ $set: { status } },
			{ returnOriginal: false }
		);
		if (!ok || err || !value)
			throw new UserInputError(`user ${email} (${value}) error: ${JSON.stringify(err)}`);
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
	updateMyApplication,
};
