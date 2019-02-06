import passport from 'koa-passport';
import { Profile as GoogleProfile } from 'passport-google-oauth';
import { Profile as GithubProfile } from 'passport-github';

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
			accessToken: string,
			refreshToken: string,
			profile: GoogleProfile,
			done: (error: any, user?: any) => void
		) => {
			console.log('> Google verify function');
			console.log(
				'accessToken: ',
				accessToken,
				'\n\nrefreshToken:',
				refreshToken,
				'\n\nProfile:',
				profile,
				'\n\ndone:',
				done
			);
			// const user = { id: 1, username: 'test', password: 'test' };
			// return async function() {
			// 	return user;
			// };
			return done(null, profile);
		}
	)
);

const GitHubStrategy = require('passport-github').Strategy;
passport.use(
	new GitHubStrategy(
		{
			callbackURL: 'http://localhost:8080/api/auth/github/callback',
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			passReqToCallback: true,
		},
		async (
			accessToken: string,
			refreshToken: string,
			profile: GithubProfile,
			done: (error: any, user?: any) => void
		) => {
			console.log('> Github verify function');
			console.log(
				'accessToken: ',
				accessToken,
				'\n\nrefreshToken:',
				refreshToken,
				'\n\nProfile:',
				profile,
				'\n\ndone:',
				done
			);
			return done(null, profile);
		}
	)
);

// passport.serializeUser((user: object, cb: (err: any, user: object) => void) => cb(null, user));
// passport.deserializeUser((obj: object, cb: (err: any, user: object) => void) => cb(null, obj));

passport.serializeUser(function(user: { id: any }, done: (arg0: null, arg1: any) => void) {
	done(null, user.id);
});

passport.deserializeUser(function(
	id: any,
	done: (arg0: null, arg1: { username: string; password: string }) => void
) {
	done(null, { username: 'Alice', password: 'password' });
});
