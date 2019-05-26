import koaRouter from 'koa-router';
import passport from 'koa-passport';
import { User, UserModel } from '../models/User';
import { HackerModel } from '../models/Hacker';
import AuthType from '../enums/AuthType';
import AuthLevel from '../enums/AuthLevel';
import Status from '../enums/Status';
import logger from '../logger';

const userRouter = new koaRouter();

type NextType = any;

/**
 * Route to get identity of user currently logged in
 * @throws 403 error is user isn't authenticated
 */
userRouter.get(
	'/api/whoami',
	async (ctx, next: () => Promise<NextType>): Promise<NextType> => {
		if (ctx.isUnauthenticated()) {
			ctx.throw(403);
		}

		const { email, firstName, lastName, authLevel, authType } = ctx.state.user;

		ctx.body = JSON.stringify({
			authLevel,
			authType,
			email,
			firstName,
			lastName,
		});

		await next();
	}
);

/**
 * Route for logging out
 */
userRouter.get(
	'/api/logout',
	async (ctx, next: () => Promise<NextType>): Promise<NextType> => {
		logger.debug('> Logging out...');
		ctx.logout();
		ctx.redirect('/login');
		await next();
	}
);

/**
 * Route for creating a new local account
 * Creates both a user and a hacker
 */
userRouter.post(
	'/api/register/hacker',
	async (ctx, next: () => Promise<NextType>): Promise<NextType> => {
		if (ctx.request.body.email) {
			logger.error('Please send email in the username field');
			ctx.throw(400);
		}
		const existingUser = await UserModel.findOne({ email: ctx.request.body.username });

		// found user
		if (existingUser) {
			logger.error('Error: Account with that email already exists');
			ctx.throw(409);
			await next();
		} else {
			// no user found, create new user
			logger.debug('> Creating new local user.....');
			const userData = {
				...ctx.request.body,
				authLevel: ctx.request.body.authLevel ? ctx.request.body.authLevel : AuthLevel.HACKER, // FIXME: Make sure people can't do this in prod
				authType: AuthType.LOCAL,
				email: ctx.request.body.username,
			};
			delete userData.username;
			const createdUser = await UserModel.create(userData);

			// successfully created user, now create hacker
			if (createdUser) {
				logger.debug('Created User');
				const createdHacker = await HackerModel.create({
					email: createdUser.email,
					gradYear: ctx.request.body.gradYear,
					needsReimbursement: ctx.request.body.needsReimbursement,
					school: ctx.request.body.school,
					status: ctx.request.body.status ? ctx.request.body.status : Status.Created,
					user: createdUser._id,
				});
				if (createdHacker) {
					ctx.body = {
						authLevel: createdUser.authLevel,
						success: true,
						username: createdUser.email,
					};
					ctx.login(createdUser);
					logger.debug('Created Hacker');
					ctx.redirect('/dashboard');
					await next();
				} else {
					logger.error('Error creating new local hacker');
					ctx.throw(401);
					await next();
				}
			} else {
				logger.error('Error creating new local user');
				ctx.throw(401);
				await next();
			}
		}
	}
);

/**
 * Returns status of a user
 * @throws a 401 error if user isn't authenticated
 */
userRouter.get(
	'/api/auth/status',
	async (ctx, next: () => Promise<NextType>): Promise<NextType> => {
		if (ctx.isAuthenticated()) {
			ctx.body = { authLevel: 'hacker', success: true, username: 'ml@ml.co' };
		} else {
			ctx.throw(401);
		}
		await next();
	}
);

/**
 * Route for logging in to a local account
 */
userRouter.post(
	'/api/login',
	async (ctx, next: () => Promise<NextType>): Promise<NextType> =>
		passport.authenticate(
			'local',
			async (err: Error, user: User): Promise<any> => {
				logger.debug('> Local auth');
				if (err) {
					logger.error(err);
				}
				if (user) {
					ctx.body = { authLevel: user.authLevel, success: true, username: user.email };
					ctx.login(user);
					logger.debug('> User:');
					logger.debug(ctx.state.user);
					ctx.redirect('/dashboard');
					await next();
				} else {
					ctx.throw(401);
					await next();
				}
			}
		)(ctx, next)
);

// Google SSO
userRouter.get(
	'/api/auth/google',
	passport.authenticate('google', { display: 'popup', scope: ['openid', 'profile', 'email'] })
);

// Google SSO callback
userRouter.get(
	'/api/auth/google/callback',
	async (ctx, next: () => Promise<NextType>): Promise<NextType> =>
		passport.authenticate(
			'google',
			async (err: Error, user: User): Promise<any> => {
				if (err) {
					logger.error(err);
				}
				if (user) {
					ctx.body = { authLevel: user.authLevel, success: true, username: user.email };
					ctx.login(user);
					logger.debug('> User:');
					logger.debug(ctx.state.user);
					ctx.redirect('/dashboard');
					await next();
				} else {
					ctx.throw(401);
					ctx.redirect('/login');
					await next();
				}
			}
		)(ctx, next)
);

// Github SSO
userRouter.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Github SSO callback
userRouter.get(
	'/api/auth/github/callback',
	async (ctx, next: () => Promise<NextType>): Promise<NextType> =>
		passport.authenticate(
			'github',
			async (err: any, user: User): Promise<any> => {
				if (err) {
					logger.error(err);
				}
				if (user) {
					ctx.body = { authLevel: user.authLevel, success: true, username: user.email };
					ctx.login(user);
					logger.debug('> User:');
					logger.debug(ctx.state.user);
					ctx.redirect('/dashboard');
					await next();
				} else {
					ctx.throw(401);
					ctx.redirect('/login');
					await next();
				}
			}
		)(ctx, next)
);

export default userRouter;
