import { Express } from 'express';
import passport from 'passport';

export const registerAuthRoutes = (app: Express, strategyNames: string[]): void => {
	passport.serializeUser((user, done) => void done(null, user));
	passport.deserializeUser((user, done) => void done(null, user));

	strategyNames.forEach(authName => {
		app.get(`/api/auth/${authName}`, passport.authenticate(authName));
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
};

export default {
	registerAuthRoutes,
};
