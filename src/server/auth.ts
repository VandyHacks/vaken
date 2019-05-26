import passport from 'koa-passport';
import bcrypt from 'bcryptjs';
import { Profile as GoogleProfile } from 'passport-google-oauth';
import { Profile as GithubProfile } from 'passport-github2';
import { UserModel, User } from './models/User';
import { HackerModel } from './models/Hacker';
import AuthType from './enums/AuthType';
import AuthLevel from './enums/AuthLevel';
import Status from './enums/Status';
import logger from './logger';

// Local authentication for non-SSO users
const LocalStrategy = require('passport-local').Strategy;
// Google OAuth2 authentication
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// Github OAuth2 authentication
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(
	new LocalStrategy(
		{ passReqToCallback: true },
		async (req: any, username: string, password: string, done: Function) => {
			logger.debug('> Local verify function');
			const user = await UserModel.findOne({ email: username });

			// no user
			if (!user) {
				logger.debug('> User does not exist');
				done(null, false);
			} else if (user.authType !== AuthType.LOCAL) {
				logger.warn('Wrong auth provider. Please use the standard local login.');
				done(null, false, { message: 'Wrong auth provider' });
			} else if (!(await bcrypt.compare(password, user.password))) {
				// wrong password
				logger.debug('> Incorrect password');
				done(null, false);
			} else {
				// found user and correct password
				logger.debug('> Logging in.....');
				done(null, user);
			}
		}
	)
);

// create hacker from user
export const createHackerFromUser = async (user: User, done: Function) => {
	const createdHacker = await HackerModel.create({
		email: user.email,
		status: Status.Created,
		user: user._id,
	});
	if (createdHacker) {
		logger.debug(user);
		done(null, user);
	} else {
		done(null, false);
	}
};

// create a new user
export const createAuthenticatedUser = async (
	authType: AuthType,
	email: string,
	id: any,
	done: Function
) => {
	logger.debug('> Creating user.....');
	const newUser = {
		authLevel: AuthLevel.HACKER,
		authType,
		email,
		githubId: authType === AuthType.GITHUB ? id : undefined,
		googleId: authType === AuthType.GOOGLE ? id : undefined,
		password: `${authType}!123`,
	};
	const createdUser = await UserModel.create(newUser);
	if (createdUser) {
		// create hacker
		createHackerFromUser(createdUser, done);
	} else {
		done(null, false);
	}
};

// factory to create OAuth strategy handlers for Passport
export const createStrategyHandler = (authType: AuthType) => async (
	req: any,
	accessToken: string,
	refreshToken: string,
	profile: GoogleProfile | GithubProfile,
	done: Function
): Promise<any> => {
	logger.debug(`> ${authType} verify function`);
	if (profile.emails) {
		const profileEmail = profile.emails[0].value;
		const user = await UserModel.findOne({ email: profileEmail });

		// found user
		if (user) {
			if (user.authType !== authType) {
				logger.warn(`Wrong auth provider. Please use ${authType}.`);
				done(null, false, { message: 'Wrong auth provider' });
			} else {
				logger.debug('> Logging in.....');
				done(null, user);
			}
		} else {
			// no user found, create new user
			createAuthenticatedUser(authType, profileEmail, (user as any).id, done);
		}
	} else {
		logger.warn('Missing email in auth profile');
		done(null, false, { message: 'Profile is missing email' });
	}
};

passport.use(
	new GoogleStrategy(
		{
			callbackURL: '/api/auth/google/callback',
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			passReqToCallback: true,
		},
		createStrategyHandler(AuthType.GOOGLE)
	)
);

passport.use(
	new GitHubStrategy(
		{
			callbackURL: '/api/auth/github/callback',
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			passReqToCallback: true,
		},
		createStrategyHandler(AuthType.GITHUB)
	)
);

passport.serializeUser((user: any, done: Function) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: any, done: Function) => {
	try {
		const user = await UserModel.findById(id);
		done(null, user);
	} catch (err) {
		done(err, null, { message: 'Failed to deserialize' });
	}
});

// for testing
export default passport;
