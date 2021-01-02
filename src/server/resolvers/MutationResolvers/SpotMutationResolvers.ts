import { UserInputError } from 'apollo-server-express';
import { ObjectID } from 'mongodb';
import Context from '../../context';
import {
	UserType,
	MutationResolvers,
	HackerDbObject,
	ApplicationStatus,
	UserDbInterface,
} from '../../generated/graphql';
import { checkIsAuthorized } from '../helpers';
import { sendStatusEmail } from '../../mail/aws';
import { Models } from '../../models';

const handleSpot = async (
	models: Models,
	statusToMarkAs: ApplicationStatus.Confirmed | ApplicationStatus.Declined,
	user?: UserDbInterface
): Promise<HackerDbObject> => {
	const { _id, status } = checkIsAuthorized(UserType.Hacker, user) as HackerDbObject;

	// find accepted hacker and set as statusToApply
	const { ok, value, lastErrorObject: err } = await models.Hackers.findOneAndUpdate(
		{ _id: new ObjectID(_id), status: ApplicationStatus.Accepted },
		{ $set: { status: statusToMarkAs } },
		{ returnOriginal: false }
	);
	if (!ok || !value)
		throw new UserInputError(
			`user ${_id} (${value}) error: ${JSON.stringify(err)}` +
				'(Likely the user already declined/confirmed if no value returned)'
		);

	// `handleSpot` is an identity function if user is already <statusToMarkAs> and is a
	// no-op if user wasn't accepted. If status changed, user is newly confirmed.
	if (value.status !== status) {
		if (statusToMarkAs === ApplicationStatus.Confirmed)
			sendStatusEmail(value, ApplicationStatus.Confirmed);
		else if (statusToMarkAs === ApplicationStatus.Declined) {
			// TODO: write decline email if you want
		}
	}
	return value;
};

export const SpotMutation: MutationResolvers<Context> = {
	confirmMySpot: async (root, _, { models, user }) =>
		handleSpot(models, ApplicationStatus.Confirmed, user),
	declineMySpot: async (root, _, { models, user }) =>
		handleSpot(models, ApplicationStatus.Declined, user),
};
