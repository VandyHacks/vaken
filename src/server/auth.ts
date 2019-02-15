import passport from 'koa-passport';
import { Profile as GoogleProfile } from 'passport-google-oauth';
import { Profile as GithubProfile } from 'passport-github2';
import { userModel } from './models/User';

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
			console.log('> Google verify function');
			// console.log(profile);
			const user = await userModel.findOne({ google: profile.id });

			// found user
			if (user) {
				console.log('> Logging in.....');
				done(null, user);
			} else {
				//no user found, create new user
				if (profile.emails) {
					console.log('> Creating user.....');
					const newUser = {
						google: profile.id,
						email: profile.emails[0].value,
					};
					const createdUser = await userModel.create(newUser);
					if (createdUser) {
						console.log(createdUser);
						done(null, createdUser);
					} else {
						done(null, false);
					}
				} else {
					console.log('Missing email');
					done(null, false);
				}
			}
		}
	)
);

const GitHubStrategy = require('passport-github2').Strategy;
passport.use(
	new GitHubStrategy(
		{
			callbackURL: 'http://localhost:8080/api/auth/github/callback',
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
			console.log('> Github verify function');
			// console.log(profile);
			const user = await userModel.findOne({ github: profile.id });

			// found user
			if (user) {
				console.log('> Logging in.....');
				done(null, user);
			} else {
				//no user found, create new user
				if (profile.emails) {
					console.log('> Creating user.....');
					const newUser = {
						github: profile.id,
						email: profile.emails[0].value,
					};
					const createdUser = await userModel.create(newUser);
					if (createdUser) {
						console.log(createdUser);
						done(null, createdUser);
					} else {
						done(null, false);
					}
				} else {
					console.log('Missing email');
					done(null, false);
				}
			}
		}
	)
);

passport.serializeUser((user: any, done: any) => {
	done(null, user.id);
});

passport.deserializeUser(async (id: any, done: any) => {
	// console.log('deserialize user');
	try {
		const user = await userModel.findById(id);
		done(null, user);
	} catch (err) {
		done(err, null, { message: 'Failed to deserialize' });
	}
});

// Copyright (c) 2019 Vanderbilt University
