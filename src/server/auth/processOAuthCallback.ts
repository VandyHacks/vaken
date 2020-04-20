import { VerifyCallback } from 'passport-oauth2';
import { Profile } from 'passport';
import { ObjectID, Collection } from 'mongodb';
import {
	UserDbInterface,
	UserType,
	ApplicationStatus,
	SponsorStatus,
	LoginDbObject,
	SponsorDbObject,
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

const handleSponsorCreation = async (
	email: string,
	profile: Profile,
	Logins: Collection<LoginDbObject>,
	Sponsors: Collection<SponsorDbObject>
): Promise<UserType> => {
	// it is a sponsor and change the status of the sponsor
	const loginRequest: LoginRequest = {
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

	return UserType.Sponsor;
};

export default async (models: Models, profile: Profile, done: VerifyCallback): Promise<void> => {
	const { Logins, Hackers, Sponsors, Organizers } = models;

	let { userType } = (await Logins.findOne({
		provider: profile.provider,
		token: profile.id,
	})) || { userType: null };

	try {
		const { emails: [{ value: email }] = [{ value: null }] } = profile;
		if (email == null) throw new Error(`Email not provided by provider ${JSON.stringify(profile)}`);

		let user: UserDbInterface | undefined;

		// Login must not exist, let's create it.
		if (userType == null) {
			logger.info('userType is null');
			logger.info(`inserting login for ${email} for ${profile.provider}`);
			// before checking hacker check if it is a whitelist sponsor
			const verifySponsor = await Sponsors.findOne({ email });
			if (verifySponsor != null) {
				// sponsors are handled a bit different because their emails are pre-entered.
				userType = await handleSponsorCreation(email, profile, Logins, Sponsors);
			} else {
				// create non sponsor users (default to Hacker type - flow for other types is currently different)
				const loginRequest: LoginRequest = {
					createdAt: new Date(),
					email,
					provider: profile.provider,
					token: profile.id,
					userType: UserType.Organizer,
				};

				logger.info(`inserting login ${JSON.stringify(loginRequest, undefined, 2)}`)
				await insertLogin(Logins, loginRequest);
			}

			try {
				// If user is truthy, then we need to insert a new user.
				user = await fetchUser({ email, userType: userType || UserType.Hacker }, models);
				logger.info(`initial fetched user ${JSON.stringify(user, undefined, 2)}`)

			} catch (e) {
				logger.info(`caught fetchUser exception`)
				// This way logging in with different providers uses the same backing hacker object.
				logger.info(`inserting ${email} (${profile.provider}) into hacker db`);
				await Organizers.insertOne({
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
		} else {
			logger.info(`userType is ${userType}`)
		}

		if (!user) {
			logger.info('fetching user after creating user')
			user = await fetchUser({ email, userType: userType || UserType.Hacker }, models);
		}

		logger.info(`fetched user ${JSON.stringify(user, undefined, 2)}`)
		return void done(undefined, user);

	} catch (err) {
		logger.info(`caught error during authentication ${JSON.stringify(err, undefined, 2)}`)
		return void done(err);
	}
};
