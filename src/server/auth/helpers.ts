import { VerifyCallback } from 'passport-oauth2';
import { Profile } from 'passport';
import { ObjectID } from 'mongodb';
import { UserType, ApplicationStatus } from '../generated/graphql';
import { Models } from '../models';
import { fetchUser } from '../resolvers/helpers';
import logger from '../logger';

export const verifyCallback = async (
	models: Models,
	profile: Profile,
	done: VerifyCallback
): Promise<void> => {
	const { Logins, Hackers } = models;
	const { userType } = (await Logins.findOne({
		provider: profile.provider,
		token: profile.id,
	})) || { userType: null };

	try {
		const { emails: [{ value: email }] = [{ value: null }] } = profile;
		if (email == null) {
			throw new Error(`Email not provided by provider ${profile}`);
		}

		if (userType == null) {
			await Logins.insertOne({
				createdAt: new Date(),
				email,
				provider: profile.provider,
				token: profile.id,
				userType: UserType.Hacker,
			});

			logger.info(`inserting user ${email}`);
			await Hackers.insertOne({
				_id: new ObjectID(),
				application: [],
				createdAt: new Date(),
				dietaryRestrictions: '',
				email,
				eventsAttended: [],
				firstName: 'New',
				lastName: 'User',
				logins: [],
				majors: [],
				modifiedAt: new Date().getTime(),
				phoneNumber: '',
				preferredName: '',
				race: '',
				secondaryIds: [],
				status: ApplicationStatus.Created,
				userType: UserType.Hacker,
			});
		}

		const user = await fetchUser({ email, userType: userType || UserType.Hacker }, models);
		return void done(null, user);
	} catch (err) {
		return void done(err);
	}
};

export default {
	verifyCallback,
};
