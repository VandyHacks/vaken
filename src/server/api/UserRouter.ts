import koaRouter from 'koa-router';
import passport from 'koa-passport';
import { UserModel } from '../models/User';
import { HackerModel } from '../models/Hacker';
import AuthType from '../enums/AuthType';
import AuthLevel from '../enums/AuthLevel';
import Status from '../enums/Status';

const userRouter = new koaRouter();

// Mongo test
userRouter.post('/mongo', async (ctx, next) => {
	const newUser = new UserModel(ctx.request.query);
	await newUser.save();
	const user = await UserModel.findOne({ firstName: 'vandy' });
	console.log(user);
	await next();
});

userRouter.get('/api/whoami', async (ctx, next) => {
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
});

userRouter.post('/api', async (ctx, next) => {
	// Dummy logging for now; TODO - flesh out this functionality
	console.log(ctx.request);
	ctx.response.status = 200;
	await next();
});

userRouter.get('/api/logout', async (ctx, next) => {
	console.log('> Logging out...');
	ctx.logout();
	ctx.redirect('/login');
	await next();
});

// Create a new local account
userRouter.post('/api/register/UNSAFE', async (ctx, next) => {
	const existingUser = await HackerModel.findOne({ email: ctx.request.body.email });

	// found user
	if (existingUser) {
		console.log('Error: Account with that email already exists');
		ctx.throw(409);
		await next();
	} else {
		//no user found, create new user
		console.log('> Creating new local user.....');
		const newUser = {
			...ctx.request.body,
			authLevel: ctx.request.body.authLevel ? ctx.request.body.authLevel : AuthLevel.HACKER,
			authType: AuthType.LOCAL,
		};
		const createdUser = await HackerModel.create(newUser);
		if (createdUser) {
			ctx.body = { authLevel: createdUser.authLevel, success: true, username: createdUser.email };
			ctx.login(createdUser);
			console.log('> User:');
			console.log(createdUser);
			ctx.redirect('/dashboard');
			await next();
		} else {
			console.log('Error creating new local user');
			ctx.throw(401);
			await next();
		}
	}
});

// Create a new local hacker account
userRouter.post('/api/register/hacker', async (ctx, next) => {
	const existingUser = await HackerModel.findOne({ email: ctx.request.body.email });

	// found user
	if (existingUser) {
		console.log('Error: Account with that email already exists');
		ctx.throw(409);
		await next();
	} else {
		//no user found, create new user
		console.log('> Creating new local hacker.....');
		const newHacker = ctx.request.body;
		newHacker.authType = AuthType.LOCAL;
		newHacker.authLevel = AuthLevel.HACKER;
		newHacker.status = Status.Created;
		console.log(newHacker);
		console.log('Attempting to create a new hacker');
		const createdHacker = await HackerModel.create(newHacker);
		if (createdHacker) {
			ctx.body = {
				authLevel: createdHacker.authLevel,
				success: true,
				username: createdHacker.email,
			};
			ctx.login(createdHacker);
			console.log('> Hacker:');
			console.log(createdHacker);
			ctx.redirect('/dashboard');
			await next();
		} else {
			console.log('Error creating new local hacker');
			ctx.throw(401);
			await next();
		}
	}
});

// Login to local account
userRouter.post('/api/login', async (ctx, next) => {
	return passport.authenticate('local', async (err: any, user: any, info: any, status: any) => {
		console.log('> Local auth');
		if (user) {
			ctx.body = { authLevel: user.authLevel, success: true, username: user.email };
			ctx.login(user);
			console.log('> User:');
			console.log(ctx.state.user);
			ctx.redirect('/dashboard');
			await next();
		} else {
			ctx.throw(401);
			await next();
		}
	})(ctx, next);
});

// Google SSO
userRouter.get(
	'/api/auth/google',
	passport.authenticate('google', { display: 'popup', scope: ['openid', 'profile', 'email'] })
);

// Google SSO callback
userRouter.get('/api/auth/google/callback', async (ctx, next) => {
	return passport.authenticate('google', async (err: any, user: any, info: any, status: any) => {
		if (user) {
			ctx.body = { authLevel: user.authLevel, success: true, username: user.email };
			ctx.login(user);
			console.log('> User:');
			console.log(ctx.state.user);
			ctx.redirect('/dashboard');
			await next();
		} else {
			ctx.throw(401);
			ctx.redirect('/login');
			await next();
		}
	})(ctx, next);
});

// Github SSO
userRouter.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Github SSO callback
userRouter.get('/api/auth/github/callback', async (ctx, next) => {
	return passport.authenticate('github', async (err: any, user: any, info: any, status: any) => {
		if (user) {
			ctx.body = { authLevel: user.authLevel, success: true, username: user.email };
			ctx.login(user);
			console.log('> User:');
			console.log(ctx.state.user);
			ctx.redirect('/dashboard');
			await next();
		} else {
			ctx.throw(401);
			ctx.redirect('/login');
			await next();
		}
	})(ctx, next);
});

export default userRouter;

// Copyright (c) 2019 Vanderbilt University
