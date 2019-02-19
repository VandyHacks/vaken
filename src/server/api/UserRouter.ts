import koaRouter from 'koa-router';
import { userModel } from '../models/User';

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

userRouter.post('/api/login', async ctx => {
	return passport.authenticate('local', (err: any, user: any, info: any, status: any) => {
		console.log('> Local auth');
		if (user) {
			ctx.body = { success: true };
			ctx.login(user);
			console.log('> User:');
			console.log(ctx.state.user);
			ctx.redirect('/dashboard');
		} else {
			ctx.body = { success: false };
			ctx.throw(401);
			ctx.redirect('/');
		}
	})(ctx);
});

userRouter.get(
	'/api/auth/google',
	passport.authenticate('google', { scope: ['openid', 'profile', 'email'], display: 'popup' })
);

userRouter.get('/api/auth/google/callback', async ctx => {
	return passport.authenticate('google', (err: any, user: any, info: any, status: any) => {
		if (user) {
			ctx.body = { success: true };
			ctx.login(user);
			console.log('> User:');
			console.log(ctx.state.user);
			ctx.redirect('/dashboard');
		} else {
			ctx.body = { success: false };
			ctx.throw(401);
			ctx.redirect('/');
		}
	})(ctx);
});

userRouter.get('/api/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

userRouter.get('/api/auth/github/callback', async ctx => {
	return passport.authenticate('github', (err: any, user: any, info: any, status: any) => {
		if (user) {
			ctx.body = { success: true };
			ctx.login(user);
			console.log('> User:');
			console.log(ctx.state.user);
			ctx.redirect('localhost:8081/dashboard');
		} else {
			ctx.body = { success: false };
			ctx.throw(401);
			ctx.redirect('/');
		}
	})(ctx);
});

export default userRouter;

// Copyright (c) 2019 Vanderbilt University
