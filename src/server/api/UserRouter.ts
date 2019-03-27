import koaRouter from 'koa-router';
import { userModel } from '../models/User';
import { hackerModel } from '../models/Hacker';

const passport = require('koa-passport');

const userRouter = new koaRouter();

// Mongo test
userRouter.post('/mongo', async (ctx, next) => {
	const newUser = new userModel(ctx.request.query);
	await newUser.save();
	const user = await userModel.findOne({ firstName: 'vandy' });
	console.log(user);
});

userRouter.post('/api', async ctx => {
	// Dummy logging for now; TODO - flesh out this functionality
	console.log(ctx.request);
	ctx.response.status = 200;
});

userRouter.get('/api/logout', async ctx => {
	console.log('> Logging out...');
	ctx.logout();
	ctx.redirect('/');
});

// Create a new local account
userRouter.post('/api/register/user', async ctx => {
	const existingUser = await userModel.findOne({ email: ctx.request.body.username });

	// found user
	if (existingUser) {
		console.log('Error: Account with that email already exists');
		ctx.redirect('/');
	} else {
		//no user found, create new user
		console.log('> Creating new local user.....');
		const newUser = {
			authLevel: 'Hacker',
			authType: 'local',
			email: ctx.request.body.email,
			password: ctx.request.body.password,
		};
		const createdUser = await userModel.create(newUser);
		if (createdUser) {
			ctx.body = { success: true };
			ctx.login(createdUser);
			console.log('> User:');
			console.log(createdUser);
			// ctx.redirect('/dashboard');
		} else {
			console.log('Error creating new local user');
			ctx.throw(401);
			// ctx.redirect('/');
		}
	}
});

// Create a new local hacker account
userRouter.post('/api/register/hacker', async ctx => {
	const existingUser = await hackerModel.findOne({ email: ctx.request.body.username });

	// found user
	if (existingUser) {
		console.log('Error: Account with that email already exists');
	} else {
		//no user found, create new user
		console.log('> Creating new local hacker.....');
		const newHacker = ctx.request.body;
		newHacker.authType = 'local';
		newHacker.authLevel = 'Hacker';
		newHacker.status = 'Created';
		console.log(newHacker);
		console.log('Attempting to create a new hacker');
		const createdHacker = await hackerModel.create(newHacker);
		if (createdHacker) {
			ctx.body = { success: true };
			ctx.login(createdHacker);
			console.log('> Hacker:');
			console.log(createdHacker);
			// ctx.redirect('/dashboard');
		} else {
			console.log('Error creating new local hacker');
			ctx.throw(401);
			// ctx.redirect('/');
		}
	}
});

// Login to local account
userRouter.post('/api/login', ctx => {
	return passport.authenticate('local', (err: any, user: any, info: any, status: any) => {
		console.log('> Local auth');
		if (user) {
			ctx.body = { authLevel: user.authLevel, success: true, username: user.email };
			ctx.login(user);
			console.log('> User:');
			console.log(ctx.state.user);
			// ctx.redirect('/dashboard');
		} else {
			ctx.throw(401);
			ctx.redirect('/');
		}
	})(ctx);
});

// Google SSO
userRouter.get(
	'/api/auth/google',
	passport.authenticate('google', { display: 'popup', scope: ['openid', 'profile', 'email'] })
);

// Google SSO callback
userRouter.get('/api/auth/google/callback', async ctx => {
	return passport.authenticate('google', (err: any, user: any, info: any, status: any) => {
		if (user) {
			ctx.body = { authLevel: user.authLevel, success: true, username: user.email };
			ctx.login(user);
			console.log('> User:');
			console.log(ctx.state.user);
			// ctx.redirect('/dashboard');
		} else {
			ctx.throw(401);
			// ctx.redirect('/');
		}
	})(ctx);
});

// Github SSO
userRouter.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Github SSO callback
userRouter.get('/api/auth/github/callback', async ctx => {
	return passport.authenticate('github', (err: any, user: any, info: any, status: any) => {
		if (user) {
			ctx.body = { authLevel: user.authLevel, success: true, username: user.email };
			ctx.login(user);
			console.log('> User:');
			console.log(ctx.state.user);
			// ctx.redirect('localhost:8081/dashboard');
		} else {
			ctx.throw(401);
			// ctx.redirect('/');
		}
	})(ctx);
});

export default userRouter;

// Copyright (c) 2019 Vanderbilt University
