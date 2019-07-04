import { Express } from 'express';
import passport from 'passport';
import { strategy as github } from './github';
import { strategy as google } from './google';

export const strategies = { github, google };

export const registerAuthRoutes = (app: Express): void => {
	passport.serializeUser((user, done) => void console.log('serializing user') || done(null, user));
	passport.deserializeUser(
		(user, done) => void console.log('deserializing user') || done(null, user)
	);

	app.get(
		'/api/auth/google',
		passport.authenticate('google', { scope: ['openid', 'profile', 'email'] })
	);
	app.get(
		'/api/auth/google/callback',
		passport.authenticate('google', {
			failureRedirect: '/login',
		}),
		(req, res) => void console.log(req.user) || res.redirect('/')
	);

	app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
	app.get(
		'/api/auth/github/callback',
		passport.authenticate('github', {
			failureRedirect: '/login',
		}),
		(req, res) => void console.log(req.user) || res.redirect('/')
	);

	app.get('/api/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

export default {
	registerAuthRoutes,
	strategies,
};
