import passport from 'koa-passport';
import bcrypt from 'bcrypt';
import { Profile as GoogleProfile } from 'passport-google-oauth';
import { Profile as GithubProfile } from 'passport-github2';
import { UserModel } from './models/User';
import { HackerModel } from './models/Hacker';
import AuthType from './enums/AuthType';
import AuthLevel from './enums/AuthLevel';
import Status from './enums/Status';
import logger from './logger';

// Local authentication for non-SSO users
const LocalStrategy = require('passport-local').Strategy;

passport.use(
	new LocalStrategy(
		{ passReqToCallback: true },
		async (req: any, username: string, password: string, done: any) => {
			logger.debug('> Local verify function');
			const user = await UserModel.findOne({ email: username });

			// no user
			if (!user) {
				logger.debug('> User does not exist');
				done(null, false);
			} else if (user.authType !== AuthType.LOCAL) {
				logger.warn('Wrong auth provider. Please use the standard local login.');
				done(null, false, { message: 'Wrong auth provider' });
			} else {
				if (!(await bcrypt.compare(password, user.password))) {
					// wrong password
					logger.debug('> Incorrect password');
					done(null, false);
				} else {
					// found user and correct password
					logger.debug('> Logging in.....');
					done(null, user);
				}
			}
		}
	)
);

// Google OAuth2 authentication
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

passport.use(
	new GoogleStrategy(
		{
			callbackURL: '/api/auth/google/callback',
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			passReqToCallback: true,
		},
		async (
			req: any,
			accessToken: string,
			refreshToken: string,
			profile: GoogleProfile,
			done: any
		) => {
			logger.debug('> Google verify function');
			if (profile.emails) {
				const user = await UserModel.findOne({ email: profile.emails[0].value });

				// found user
				if (user) {
					if (user.authType !== AuthType.GOOGLE) {
						logger.warn('Wrong auth provider. Please use Google.');
						done(null, false, { message: 'Wrong auth provider' });
					} else {
						logger.debug('> Logging in.....');
						done(null, user);
					}
				} else {
					// no user found, create new user
					logger.debug('> Creating user.....');
					const newUser = {
						authLevel: AuthLevel.HACKER,
						authType: AuthType.GOOGLE,
						email: profile.emails[0].value,
						googleId: profile.id,
						password: 'Google!123',
					};
					const createdUser = await UserModel.create(newUser);
					if (createdUser) {
						// create hacker
						const createdHacker = await HackerModel.create({
							email: createdUser.email,
							status: Status.Created,
							user: createdUser._id,
						});
						if (createdHacker) {
							logger.debug(createdUser);
							done(null, createdUser);
						} else {
							done(null, false);
						}
					} else {
						done(null, false);
					}
				}
			} else {
				logger.warn('Missing email in auth profile');
				done(null, false, { message: 'Profile is missing email' });
			}
		}
	)
);

// Github OAuth2 authentication
const GitHubStrategy = require('passport-github2').Strategy;

passport.use(
	new GitHubStrategy(
		{
			callbackURL: '/api/auth/github/callback',
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			passReqToCallback: true,
		},
		async (
			req: any,
			accessToken: string,
			refreshToken: string,
			profile: GithubProfile,
			done: any
		) => {
			logger.debug('> Github verify function');
			if (profile.emails) {
				const user = await UserModel.findOne({ email: profile.emails[0].value });

				// found user
				if (user) {
					if (user.authType !== AuthType.GITHUB) {
						logger.warn('Wrong auth provider. Please use Github.');
						done(null, false, { message: 'Wrong auth provider' });
					} else {
						logger.debug('> Logging in.....');
						done(null, user);
					}
				} else {
					// no user found, create new user
					logger.debug('> Creating user.....');
					const newUser = {
						authLevel: AuthLevel.HACKER,
						authType: AuthType.GITHUB,
						email: profile.emails[0].value,
						githubId: profile.id,
						password: 'Github!123',
					};
					const createdUser = await UserModel.create(newUser);
					if (createdUser) {
						// create hacker
						const createdHacker = await HackerModel.create({
							email: createdUser.email,
							status: Status.Created,
							user: createdUser._id,
						});
						if (createdHacker) {
							logger.debug(createdUser);
							done(null, createdUser);
						} else {
							done(null, false);
						}
					} else {
						done(null, false);
					}
				}
			} else {
				logger.warn('Missing email in auth profile');
				done(null, false, { message: 'Profile is missing email' });
			}
		}
	)
);

passport.serializeUser((user: any, done: any) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: any, done: any) => {
	try {
		const user = await UserModel.findById(id);
		done(null, user);
	} catch (err) {
		done(err, null, { message: 'Failed to deserialize' });
	}
});
