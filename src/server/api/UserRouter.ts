import koaRouter from 'koa-router';

const userRouter = new koaRouter();

userRouter.post('/login', async ctx => {
	// Dummy logging for now; TODO - flesh out this functionality
	console.log(ctx.request);
});

export default userRouter;
