import { VerifyCallback } from 'passport-oauth2';
import { VerifyCallback as GVerifyCallback } from 'passport-google-oauth20';
import { Profile } from 'passport';
import { ObjectID } from 'mongodb';
import { IProfile } from 'passport-azure-ad';
import { UserDbInterface, UserType, ApplicationStatus, SponsorStatus } from '../generated/graphql';
import { Models } from '../models';
import { fetchUser } from '../resolvers/helpers';
import logger from '../logger';

// export async function getUserFromDb(email: string, userType?: string): Promise<UserDbInterface> {
// 	const { Hackers, Organizers, Sponsors } = await new DB().collections;

// 	let user: UserDbInterface | null = null;
// 	switch (userType) {
// 		case UserType.Hacker:
// 			user = await Hackers.findOne({ email });
// 			break;
// 		case UserType.Organizer:
// 			user = await Organizers.findOne({ email });
// 			break;
// 		case UserType.Sponsor:
// 			user = await Sponsors.findOne({ email });
// 			break;
// 		default:
// 			throw new Error(`invalid userType '${userType}'`);
// 	}

// 	if (!user) {
// 		throw new Error(`couldn't find user (${user}) with email ${email}`);
// 	}

// 	return user;
// }

export const verifyCallback = async (
	models: Models,
	profile: Profile,
	done: VerifyCallback | GVerifyCallback
): Promise<void> => {
	const { Logins, Hackers, Sponsors } = models;

	let { userType } = (await Logins.findOne({
		provider: profile.provider,
		token: profile.id,
	})) || { userType: null };

	try {
		const { emails: [{ value: email }] = [{ value: null }] } = profile;
		if (email == null) throw new Error(`Email not provided by provider ${JSON.stringify(profile)}`);

		let user: UserDbInterface | undefined;

		if (userType == null) {
			// Login must not exist.
			logger.info(`inserting login for ${email} for ${profile.provider}`);
			// before checking hacker check if it is a whitelist sponsor
			const verifySponsor = await Sponsors.findOne({ email });
			if (verifySponsor != null) {
				// it is a sponsor and change the status of the sponsor
				await Logins.insertOne({
					createdAt: new Date(),
					email,
					provider: profile.provider,
					token: profile.id,
					userType: UserType.Sponsor,
				});
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
				await Logins.insertOne({
					createdAt: new Date(),
					email,
					provider: profile.provider,
					token: profile.id,
					userType: UserType.Hacker,
				});
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

export const verifyMicrosoftCallback = async (
	models: Models,
	profile: IProfile,
	done: VerifyCallback
): Promise<void> => {
	const PROVIDER = 'microsoft';

	const token = profile._json.sub; // TODO: this can be so much prettier once we get optional chaining
	if (token == null) throw new Error(`Token not provided by ${PROVIDER}`);

	const { Logins, Hackers } = models;
	const { userType } = (await Logins.findOne({
		provider: PROVIDER,
		token,
	})) || { userType: null };

	try {
		let { emails: [{ value: email }] = [{ value: null }] } = profile;
		if (email == null) {
			email = profile._json.email;
			if (email == null) throw new Error(`Email not provided by provider ${PROVIDER}`);
		}
		let user: UserDbInterface | undefined;

		if (userType == null) {
			// Login must not exist.
			logger.info(`inserting login for ${email} for ${PROVIDER}`);
			await Logins.insertOne({
				createdAt: new Date(),
				email,
				provider: PROVIDER,
				token,
				userType: UserType.Hacker,
			});

			try {
				// If user is truthy, then we need to insert a new user.
				user = await fetchUser({ email, userType: userType || UserType.Hacker }, models);
			} catch (e) {
				// This way logging in with different providers uses the same backing hacker object.
				logger.info(`inserting ${email} (${PROVIDER}) into hacker db`);
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
		return void done(null, user);
	} catch (err) {
		return void done(err);
	}
};

export default {
	verifyCallback,
	verifyMicrosoftCallback,
};
