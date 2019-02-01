import koaRouter from 'koa-router';
import { Context } from 'koa';

const passport = require('koa-passport');
const userRouter = new koaRouter();
const Koa = require('koa');

// const app = new Koa();
// app.use(passport.initialize());

userRouter.post('/api/login', async ctx => {
	// Dummy logging for now; TODO - flesh out this functionality
	console.log(ctx.request);
	ctx.response.status = 200;
});

userRouter.get(
	'/api/auth/google',
	passport.authenticate('google', { scope: ['profile'], display: 'popup' }),
	ctx => {
		console.log('inside /api/auth/google ');
	}
);

userRouter.get(
	'/api/auth/google/callback',
	passport.authenticate(
		'google',
		{ successRedirect: '/dashboard', failureRedirect: '/login' },
		(err: any, user: any, info: any, status: any) => {
			console.log('name: ' + user.name);
		}
	)
);

// (ctx: Context, next: any)

// (ctx: any) => {
// 	console.log('inside /api/auth/google/callback');
// 	const user = {
// 		name: ctx.params.user.displayName,
// 	};
// 	console.log('name: ' + user.name);
// })

// userRouter
//   .get('/', (ctx, next) => {
//     ctx.body = 'Hello World!';
//   })

// app.use(userRouter.routes()).use(userRouter.allowedMethods());
export default userRouter;
