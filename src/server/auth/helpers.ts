import { VerifyCallback } from 'passport-oauth2';
import { Profile } from 'passport';
import { ObjectID } from 'mongodb';
import { UserDbInterface, UserType, ApplicationStatus } from '../generated/graphql';
import modelsPromise from '../models';
import logger from '../logger';

export async function getUserFromDb(email: string, userType?: string): Promise<UserDbInterface> {
	const { Hackers, Organizers } = await modelsPromise;

	let user: UserDbInterface | null = null;
	switch (userType) {
		case UserType.Hacker:
			user = await Hackers.findOne({ email });
			break;
		case UserType.Organizer:
			user = await Organizers.findOne({ email });
			break;
		default:
			throw new Error(`invalid userType '${userType}'`);
	}

	if (!user) {
		throw new Error(`couldn't find user (${user}) with email ${email}`);
	}

	return user;
}

export const verifyCallback = async (profile: Profile, done: VerifyCallback): Promise<void> => {
	const { Logins, Hackers } = await modelsPromise;
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
				createdAt: new Date(),
				dietaryRestrictions: [],
				email,
				firstName: 'New',
				lastName: 'User',
				logins: [],
				majors: [],
				modifiedAt: new Date().getTime(),
				phoneNumber: '',
				preferredName: '',
				race: [],
				secondaryIds: [],
				status: ApplicationStatus.Confirmed,
				userType: UserType.Hacker,
			});
		}

		const user = await getUserFromDb(email, userType || UserType.Hacker);
		return void done(null, user);
	} catch (err) {
		return void done(err);
	}
};

export default {
	getUserFromDb,
	verifyCallback,
};
