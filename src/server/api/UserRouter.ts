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

userRouter.post('/api/login', async ctx => {
	// Dummy logging for now; TODO - flesh out this functionality
	console.log(ctx.request);
	ctx.response.status = 200;
});

userRouter.get(
	'/api/auth/google',
	passport.authenticate('google', { scope: ['openid', 'profile', 'email'], display: 'popup' }),
	ctx => {
		console.log('inside /api/auth/google');
	}
);

userRouter.get('/api/auth/google/callback', async ctx => {
	return passport.authenticate('google', (err: any, user: any, info: any, status: any) => {
		ctx.redirect('/');
		// console.log(ctx);
		console.log('> User:');
		console.log(user);
	})(ctx);
});

userRouter.get(
	'/api/auth/github',
	passport.authenticate('github', { scope: ['read:user', 'user:email'] }),
	ctx => {
		console.log('inside /api/auth/github');
	}
);

userRouter.get('/api/auth/github/callback', async ctx => {
	return passport.authenticate('github', (err: any, user: any, info: any, status: any) => {
		ctx.redirect('/');
		console.log(ctx, err, user, info, status);
	})(ctx);
});

// app.use(userRouter.routes()).use(userRouter.allowedMethods());
export default userRouter;
