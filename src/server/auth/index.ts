import { Express } from 'express';
import passport from 'passport';

export interface StrategyNames {
	displayName: string;
	name: string;
	scopes: string[];
}

export const registerAuthRoutes = (app: Express, strategies: StrategyNames[]): void => {
	passport.serializeUser((user, done) => void done(null, user));
	passport.deserializeUser((user, done) => void done(null, user));

	strategies.forEach(({ name: authName, scopes }) => {
		app.get(`/api/auth/${authName}`, passport.authenticate(authName, { scope: scopes }));
		app.get(
			`/api/auth/${authName}/callback`,
			passport.authenticate(authName, {
				failureRedirect: '/login',
			}),
			(_, res) => void res.redirect('/')
		);
	});

	app.get('/api/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	// register master route that gives all providers
	// using restful because it's weird for part of auth to not be restful
	app.get('/api/auth', (_, res) => {
		res.send(strategies);
	});
};

export default {
	registerAuthRoutes,
};
