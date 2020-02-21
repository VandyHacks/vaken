import { VerifyCallback } from 'passport-oauth2';
import { Profile } from 'passport';
import { ObjectID, Collection } from 'mongodb';
import {
	UserDbInterface,
	UserType,
	ApplicationStatus,
	SponsorStatus,
	LoginDbObject,
} from '../generated/graphql';
import { Models } from '../models';
import { fetchUser } from '../resolvers/helpers';
import logger from '../logger';

// Type of request that will be sent to LoginDbObject
interface LoginRequest {
	createdAt: Date;
	email: string;
	provider: string;
	token: string;
	userType: UserType;
}

// inserts a login to pass loginModel
async function insertLogin(
	loginsModel: Collection<LoginDbObject>,
	login: LoginRequest
): Promise<void> {
	await loginsModel.insertOne(login);
}

export default async (models: Models, profile: Profile, done: VerifyCallback): Promise<void> => {
	const { Logins, Hackers, Sponsors } = models;

	let { userType } = (await Logins.findOne({
		provider: profile.provider,
		token: profile.id,
	})) || { userType: null };

	try {
		const { emails: [{ value: email }] = [{ value: null }] } = profile;
		if (email == null) throw new Error(`Email not provided by provider ${JSON.stringify(profile)}`);

		let user: UserDbInterface | undefined;
		let loginRequest: LoginRequest | undefined;

		if (userType == null) {
			// Login must not exist.
			logger.info(`inserting login for ${email} for ${profile.provider}`);
			// before checking hacker check if it is a whitelist sponsor
			const verifySponsor = await Sponsors.findOne({ email });
			if (verifySponsor != null) {
				// it is a sponsor and change the status of the sponsor
				loginRequest = {
					createdAt: new Date(),
					email,
					provider: profile.provider,
					token: profile.id,
					userType: UserType.Sponsor,
				};

				await insertLogin(Logins, loginRequest);

				// useSponsorStatusMutation({
				// 	variables: { input: { email, status: SponsorStatus.Created } }
				// });
				await Sponsors.findOneAndUpdate(
					{ email },
					{ $set: { status: SponsorStatus.Created } },
					{ returnOriginal: false }
				);
				userType = UserType.Sponsor;
			} else {
				loginRequest = {
					createdAt: new Date(),
					email,
					provider: profile.provider,
					token: profile.id,
					userType: UserType.Hacker,
				};
				await insertLogin(Logins, loginRequest);
			}

			try {
				// If user is truthy, then we need to insert a new user.
				user = await fetchUser({ email, userType: userType || UserType.Hacker }, models);
			} catch (e) {
				// This way logging in with different providers uses the same backing hacker object.
				logger.info(`inserting ${email} (${profile.provider}) into hacker db`);
				await Hackers.insertOne({
					_id: new ObjectID(),
					application: [],
					createdAt: new Date(),
					dietaryRestrictions: '',
					email,
					emailUnsubscribed: false,
					eventsAttended: [],
					firstName: '',
					lastName: '',
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
		}

		if (!user) user = await fetchUser({ email, userType: userType || UserType.Hacker }, models);
		return void done(undefined, user);
	} catch (err) {
		return void done(err);
	}
};
