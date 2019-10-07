import { Express } from 'express';
import passport from 'passport';
import { strategy as github } from './github';
import { strategy as google } from './google';
import { strategy as microsoft } from './microsoft';

export const strategies = { github, google, microsoft };

export const registerAuthRoutes = (app: Express): void => {
	passport.serializeUser((user, done) => void done(null, user));
	passport.deserializeUser((user, done) => void done(null, user));

	app.get(
		'/api/auth/google',
		passport.authenticate('google', { scope: ['openid', 'profile', 'email'] })
	);
	app.get(
		'/api/auth/google/callback',
		passport.authenticate('google', {
			failureRedirect: '/login',
		}),
		(req, res) => void res.redirect('/')
	);

	app.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));
	app.get(
		'/api/auth/github/callback',
		passport.authenticate('github', {
			failureRedirect: '/login',
		}),
		(req, res) => void res.redirect('/')
	);

	app.get('/api/auth/microsoft', passport.authenticate('microsoft'));
	app.get(
		'/api/auth/microsoft/callback',
		passport.authenticate('microsoft', {
			failureRedirect: '/login',
		}),
		(req, res) => void res.redirect('/')
	);

	app.get('/api/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};

export default {
	registerAuthRoutes,
	strategies,
};
