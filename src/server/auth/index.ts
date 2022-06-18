import { Express } from 'express';
import passport from 'passport';
import { User, UserType } from '../generated/graphql';
import { Models } from '../models';
import { fetchUser } from '../resolvers/helpers';

export interface StrategyNames {
	displayName: string;
	name: string;
	scopes: string[];
}

export const registerAuthRoutes = (
	app: Express,
	strategies: StrategyNames[],
	models: Models
): void => {
	passport.serializeUser(({ email, userType }: User, done) => {
		void done(null, { email, userType });
	});
	passport.deserializeUser(
		async ({ email, userType }: { email: string; userType: UserType }, done) => {
			done(null, await fetchUser({ email, userType }, models));
		}
	);

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
