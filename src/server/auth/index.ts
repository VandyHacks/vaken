import { Express } from 'express';
import passport from 'passport';

// registers a single route given name of strat
export const registerAuthRoute = (app: Express, name: string): void => {
	app.get(`/api/auth/${name}`, passport.authenticate(name));
	app.get(
		`/api/auth/${name}/callback`,
		passport.authenticate(name, {
			failureRedirect: '/login',
		}),
		(req, res) => void res.redirect('/')
	);
};

// performs general registration of routes
export const registerAuthRoutes = (app: Express): void => {
	passport.serializeUser((user, done) => void done(null, user));
	passport.deserializeUser((user, done) => void done(null, user));

	app.get('/api/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});
};

export default {
	registerAuthRoutes,
	registerAuthRoute,
};
